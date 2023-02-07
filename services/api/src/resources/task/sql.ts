import { knex } from '../../util/db';

export const Sql = {
  selectTask: (id: number) =>
    knex('task')
      .where('task.id', '=', id)
      .toString(),
  insertTask: ({
    id,
    name,
    taskName,
    status,
    created,
    started,
    completed,
    environment,
    service,
    command,
    remoteId,
    adminTask,
    adminOnlyView,
    type = null,
    advanced_image = null,
    advanced_payload = null,
  }: {
    id: number;
    name: string;
    taskName: string,
    status: string;
    created: string;
    started: string;
    completed: string;
    environment: number;
    service: string;
    command: string;
    remoteId: string;
    adminTask: boolean;
    adminOnlyView: boolean;
    type?: string;
    advanced_image?: string;
    advanced_payload?: string;
  }) =>
    knex('task')
      .insert({
        id,
        name,
        taskName,
        status,
        created,
        started,
        completed,
        environment,
        service,
        command,
        adminTask,
        adminOnlyView,
        remoteId,
        type,
        advanced_image,
        advanced_payload,
      })
      .toString(),
  deleteTask: (id: number) =>
    knex('task')
      .where('id', id)
      .del()
      .toString(),
  updateTask: ({ id, patch }: { id: number; patch: { [key: string]: any } }) =>
    knex('task')
      .where('id', id)
      .update(patch)
      .toString(),
  selectPermsForTask: (id: number) =>
    knex('task')
      .select({ pid: 'environment.project', adminOnlyView: 'task.admin_only_view', adminTask: 'task.admin_task' })
      .join('environment', 'task.environment', '=', 'environment.id')
      .where('task.id', id)
      .toString(),
  insertAdvancedTaskDefinition: ({
    id,
    name,
    description,
    image,
    command,
    created,
    type,
    service,
    project,
    group_name,
    environment,
    permission,
    confirmation_text,
    admin_task,
    admin_only_view,
    }: {
      id: number,
      name: string,
      description: string,
      image: string,
      command: string,
      created: string,
      type: string,
      service: string,
      project: number,
      group_name: string,
      environment: number,
      permission: string,
      confirmation_text: string,
      admin_task: boolean,
      admin_only_view: boolean,
    }) =>
    knex('advanced_task_definition')
      .insert({
        id,
        name,
        description,
        image,
        command,
        created,
        type,
        service,
        project,
        group_name,
        environment,
        permission,
        confirmation_text,
        admin_task,
        admin_only_view,
      })
    .toString(),
    insertAdvancedTaskDefinitionArgument: ({
      id,
      advanced_task_definition,
      name,
      type,
      displayName,
      }: {
        id: number,
        advanced_task_definition: number,
        name: string,
        type: string,
        displayName: string,
      }) =>
      knex('advanced_task_definition_argument')
        .insert({
          id,
          advanced_task_definition,
          name,
          type,
          display_name: displayName
        })
      .toString(),
    updateAdvancedTaskDefinition: ({ id, patch }: { id: number; patch: { [key: string]: any } }) =>
     knex('advanced_task_definition')
       .where('id', id)
       .update(patch)
       .toString(),
    selectAdvancedTaskDefinitionEnvironmentLinkById: (id: number) =>
          knex('task_registration')
            .where('task_registration.id', '=', id)
          .toString(),
    selectTaskRegistrationById: (id: number) =>
      knex('task_registration')
        .where('task_registration.id', '=', id)
        .toString(),
    selectTaskRegistrationsByEnvironmentId:(id: number) =>
      knex('advanced_task_definition')
        .select('advanced_task_definition.*', 'task_registration.id')
        .join('task_registration', 'task_registration.advanced_task_definition', '=', 'advanced_task_definition.id')
        .where('task_registration.environment', '=', id)
        .toString(),
    selectTaskRegistrationByEnvironmentIdAndAdvancedTaskId: (environmentId: number, task: number) =>
      knex('task_registration')
        .where('task_registration.environment', '=', environmentId)
        .where('task_registration.advanced_task_definition', '=', task)
        .toString(),
    selectAdvancedTaskDefinition:(id: number) =>
      knex('advanced_task_definition')
        // .select(knex.raw(`*, true as "show_ui"`)) //synthetic true
        .where('advanced_task_definition.id', '=', id)
        .toString(),
    selectAdvancedTaskDefinitionArguments:(id: number) =>
      knex('advanced_task_definition_argument')
        .where('advanced_task_definition_argument.advanced_task_definition', '=', id)
        .toString(),
    selectAdvancedTaskDefinitionArgumentById:(id: number) =>
      knex('advanced_task_definition_argument')
        .where('advanced_task_definition_argument.id', '=', id)
        .toString(),
    deleteAdvancedTaskDefinitionArgumentByTaskDef:(advanced_task_definition: number) =>
      knex('advanced_task_definition_argument')
        .where('advanced_task_definition_argument.advanced_task_definition', '=', advanced_task_definition)
        .del()
        .toString(),
    selectAdvancedTaskDefinitionByName:(name: string) =>
      knex('advanced_task_definition')
        // .select(knex.raw(`*, true as "show_ui"`))
        .where('advanced_task_definition.name', '=', name)
        .toString(),
    selectAdvancedTaskDefinitionByNameProjectEnvironmentAndGroup:(name: string, project: number, environment: number, group: string) => {
      let query = knex('advanced_task_definition')
        .where('advanced_task_definition.name', '=', name);
        if(project) {
          query = query.where('advanced_task_definition.project', '=', project)
        }
        if(environment) {
          query = query.where('advanced_task_definition.environment', '=', environment)
        }
        if(group) {
          query = query.where('advanced_task_definition.group_name', '=', group)
        }
        return query.toString()
    },
  selectAdvancedTaskDefinitions:() =>
    knex('advanced_task_definition')
    // .select(knex.raw(`*, true as "show_ui"`))
    .toString(),
  selectAdvancedTaskDefinitionsForEnvironment:(id: number) =>
    knex('advanced_task_definition')
    // .select(knex.raw(`*, true as "show_ui"`))
    .where('environment', '=', id)
    .toString(),
  selectAdvancedTaskDefinitionsForProject:(id: number) =>
    knex('advanced_task_definition')
    // .select(knex.raw(`*, true as "show_ui"`))
    .where('project', '=', id)
    .toString(),
  selectAdvancedTaskDefinitionsForGroups:(groups) =>
    knex('advanced_task_definition')
    // .select(knex.raw(`*, true as "show_ui"`))
    .where('group_name', 'in', groups)
    .toString(),
  deleteAdvancedTaskDefinition:(id: number) =>
    knex('advanced_task_definition')
    .where('id', id)
    .del()
    .toString(),
  deleteAdvancedTaskDefinitionArgumentsForTask:(taskId: number) => knex('advanced_task_definition_argument')
    .where('advanced_task_definition', taskId)
    .del()
    .toString(),
};
