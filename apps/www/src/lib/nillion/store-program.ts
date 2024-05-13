import { nillionConfig } from './config';

export async function storeProgram(nillionClient: any, programName: string) {
  try {
    const compiledProgram = await fetch(`/programs/${programName}.nada.bin`);

    const arrayBufferProgram = await compiledProgram.arrayBuffer();
    const uint8Program = new Uint8Array(arrayBufferProgram);

    const actionId = await nillionClient.store_program(
      nillionConfig.cluster_id,
      programName,
      uint8Program
    );

    const userId = nillionClient.user_id as string;
    const programId = `${userId}/${programName}`;
    return programId;
  } catch (error) {
    console.log(error);
    return 'error';
  }
}
