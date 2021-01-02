import { parseNumberList } from '.'

type Letter = 'M' | 'm' | 'L' | 'l' | 'H' | 'h' | 'V' | 'v' | 'C' | 'c' | 'S' | 's' | 'Q' | 'q' | 'T' | 't' | 'A' | 'a' | 'Z' | 'z'

export type Command = {
    letter: Letter,
    parameters: number[],
}

function expectedLengthParameters(letter: Letter): number {
    if('MLT'.includes(letter.toLocaleUpperCase())) {
        return 2
    }
    if('HV'.includes(letter.toLocaleUpperCase())) {
        return 1
    }
    if('C'.includes(letter.toLocaleUpperCase())) {
        return 6
    }
    if('SQ'.includes(letter.toLocaleUpperCase())) {
        return 4
    }
    if('A'.includes(letter.toLocaleUpperCase())) {
        return 7
    }
    if('Z'.includes(letter.toLocaleUpperCase())) {
        return 0
    }
    throw new Error('Invalid command letter')
}

function getImplictNextLetter(letter: Letter): Letter {
    if(letter === 'M') {
        return 'L'
    }
    if(letter === 'm') {
        return 'l'
    }
    return letter
}

export default function parsePath(value: string): Command[] {
    let result = [] as { letter: Letter, parameters: number[] }[]
    let commands = value.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g)
    
    if(!commands) {
        return []
    }

    try {
        for(let command of commands) {
            let letter = command[0] as Letter
            let parameters = parseNumberList(command.substr(1))

            // edge case: 0 % 0 is NaN
            if(expectedLengthParameters(letter) === 0 && parameters.length === 0) {
                result.push({
                    letter,
                    parameters: []
                })
            }
            
            if(parameters.length % expectedLengthParameters(letter) !== 0) {
                // keep path until this point
                break
            }

            while(parameters.length >= expectedLengthParameters(letter)) {
                result.push({
                    letter,
                    parameters: parameters.slice(0, expectedLengthParameters(letter))
                })
                letter = getImplictNextLetter(letter)
                parameters = parameters.slice(expectedLengthParameters(letter))
            }
        }
    } catch {
        // keep path until an error happens
    }
    
    return result
}