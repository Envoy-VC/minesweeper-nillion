import { nillionConfig } from './config';

import type { JsInput } from '~/types/nillion';

export async function storeSecretsInteger(
  nillion: any,
  nillionClient: any,
  secretsToStore: JsInput[],
  program_id: string,
  party_name: string,
  usersWithRetrievePermissions: string[] = [],
  usersWithUpdatePermissions: string[] = [],
  usersWithDeletePermissions: string[] = [],
  usersWithComputePermissions: string[] = []
): Promise<string> {
  try {
    const secrets = new nillion.Secrets();

    for (const secret of secretsToStore) {
      const newSecret = nillion.Secret.new_integer(secret.value.toString());
      secrets.insert(secret.name, newSecret);
    }

    const secret_program_bindings = new nillion.ProgramBindings(program_id);
    const party_id = nillionClient.party_id;
    secret_program_bindings.add_input_party(party_name, party_id);

    const user_id = nillionClient.user_id;
    const permissions = nillion.Permissions.default_for_user(
      user_id,
      program_id
    );

    const computePermissions: { [key: string]: string[] } = {};
    for (const user of usersWithComputePermissions) {
      computePermissions[user] = [program_id];
    }

    permissions.add_compute_permissions(computePermissions);
    permissions.add_retrieve_permissions(usersWithRetrievePermissions);
    permissions.add_update_permissions(usersWithUpdatePermissions);
    permissions.add_delete_permissions(usersWithDeletePermissions);

    const store_id = await nillionClient.store_secrets(
      nillionConfig.cluster_id,
      secrets,
      secret_program_bindings,
      permissions
    );
    return store_id;
  } catch (error) {
    console.log(error);
    return 'error';
  }
}
