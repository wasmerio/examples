import { createTemplateRegistry } from '@templates/define';
import defaultTemplate from '@templates/default';
import friendTemplate from '@templates/friend';

/** Add new template definitions here; each definition owns its unique ID. */
export const templates = [defaultTemplate, friendTemplate] as const;

export const { getTemplate, listTemplates } = createTemplateRegistry(templates);
