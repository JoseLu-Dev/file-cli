import { SpecificOptions } from '../../../common/business/command/commandOptions';
export interface GroupOptions extends SpecificOptions{
    dateCreated?:  string
    extension?: string | 'type'| 'subtype' | 'mimetype'
}