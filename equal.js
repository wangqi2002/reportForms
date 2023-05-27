let pattern = '^${param}$'

function configurePattern(param) {
    pattern = eval('`' + pattern + '`')
}

function filter(x) {
    return pattern.test(x)
}
