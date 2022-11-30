import { Command, Option } from '@commander-js/extra-typings'
import { Service } from 'typedi'

import { GroupFiles } from './group/business/groupFiles'
import { GroupOptions } from './group/business/groupOptions'

@Service()
export class CommandMediator {

    constructor(private readonly _groupFiles: GroupFiles) { }

    /**
     * Defines and adds commands to a commander-js program
     * @param program commander-js program to add commands to
     */
    mediate(program: Command) {

        const executionPath = process.cwd()

        program
            .command('group')
            .description('Group files depending on flags')
            .option('-d, --date-created [format]', 'By date created')
            .addOption(new Option('-e, --extension [option]', 'By extension type').choices(['type', 'subtype', 'mimetype']))
            .action((options: GroupOptions) => {
                this._groupFiles.execute({path: executionPath, specificOptions: options})
            })
    }
}