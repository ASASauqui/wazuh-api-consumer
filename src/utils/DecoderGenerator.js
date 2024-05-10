export const getDecoder = (log, decoderName) => {
    let decoder = "";

    const programName = log.match(/(?<=\s)[a-zA-Z_]+(?=:)/g);
    const variables = log.match(/(?<=\s)[a-zA-Z_]+(?=\s*=)/g);
    
    decoder += `
    <decoder name="${decoderName}">
        <program_name>${programName}</program_name>
    </decoder>

    <decoder name="${decoderName}">
        <parent>${decoderName}</parent>
        <regex>${variables.map(variable => `${variable}=(\\S+)`).join(' ')}</regex>
        <order>${variables.join(', ')}</order>
    </decoder>
    `;

    return decoder;

}

export const getRule = (decoder, ruleId, level, description, variables) => {
    let rule = "";

    const programName = decoder.match(/(?<=<program_name>)(.*?)(?=<\/program_name>)/g)[0];
    const decoderName = decoder.match(/(?<=<decoder name=")(.*?)(?=">)/g)[0];

    const cleanVariables = {};

    Object.keys(variables).forEach(variable => {
        if (variables[variable] === '') {
            return;
        }
        cleanVariables[variable] = variables[variable].replace(/ /g, '');
    } );

    rule += `
    <group name="${programName},">
        <rule id="${ruleId}" level="${level}">
            <decoded_as>${decoderName}</decoded_as>
            ${
                Object.keys(cleanVariables).map(variable => (
                    `<field name="${variable}">${variables[variable]}</field>`
                )).join('\n\t\t\t')
            }
            <description>${description}</description>
        </rule>
    </group>
    `;

    return rule;

}