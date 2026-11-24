import EventEmitter from 'node:events';
import { Command, KillProcess, SpawnCommand } from '../command.js';
import { Logger } from '../logger.js';
import { FlowController } from './flow-controller.js';
export declare class Teardown implements FlowController {
    private readonly logger;
    private readonly spawn;
    private readonly teardown;
    private readonly process;
    private readonly kill;
    constructor({ logger, spawn, commands, process, kill, }: {
        logger: Logger;
        /**
         * Which function to use to spawn commands.
         */
        spawn: SpawnCommand;
        commands: readonly string[];
        /**
         * The process whose signals go to a running teardown command.
         */
        process?: EventEmitter;
        /**
         * How to send a signal to a running teardown command. Defaults to `tree-kill`.
         */
        kill?: KillProcess;
    });
    handle(commands: Command[]): {
        commands: Command[];
        onFinish: () => Promise<void>;
    };
}
