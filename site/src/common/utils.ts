export function peopleCount(count: number) {
    if (count > 1) {
        return "are "+count+" people"
    }
    if ( count === 0 ) {
        return "are no people"
    }
    return "is one person"
}

