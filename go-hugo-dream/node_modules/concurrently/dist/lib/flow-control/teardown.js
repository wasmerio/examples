import Rx from 'rxjs';
import treeKill from 'tree-kill';
import { getSpawnOpts } from '../spawn.js';
const SIGNALS = ['SIGINT', 'SIGTERM', 'SIGHUP'];
export class Teardown {
    logger;
    spawn;
    teardown;
    process;
    kill;
    constructor({ logger, spawn, commands, process = globalThis.process, kill = treeKill, }) {
        this.logger = logger;
        this.spawn = spawn;
        this.teardown = commands;
        this.process = process;
        this.kill = kill;
    }
    handle(commands) {
        const { logger, teardown, spawn, process, kill } = this;
        if (!teardown.length) {
            return { commands, onFinish: async () => { } };
        }
        // Listen from the start: the other signal handlers are removed when the commands finish,
        // and in the moment between that and a listener added later, a signal would kill
        // concurrently and leave a teardown command running. Until teardown starts, these do
        // nothing.
        let tearingDown = false;
        let caughtSignal;
        let child;
        const forwardSignal = (signal) => {
            if (!tearingDown) {
                return;
            }
            caughtSignal = signal;
            if (child?.pid) {
                kill(child.pid, signal);
            }
        };
        SIGNALS.forEach((signal) => process.on(signal, forwardSignal));
        const onFinish = async () => {
            tearingDown = true;
            try {
                for (const command of teardown) {
                    // A signal during teardown ends it.
                    if (caughtSignal) {
                        break;
                    }
                    logger.logGlobalEvent(`Running teardown command "${command}"`);
                    child = spawn(command, getSpawnOpts({ stdio: 'raw' }));
                    const error = Rx.fromEvent(child, 'error');
                    const close = Rx.fromEvent(child, 'close');
                    try {
                        const [exitCode, signal] = await Promise.race([
                            Rx.firstValueFrom(error).then((event) => {
                                throw event;
                            }),
                            Rx.firstValueFrom(close).then((event) => event),
                        ]);
                        logger.logGlobalEvent(`Teardown command "${command}" exited with code ${exitCode ?? signal}`);
                        if (signal === 'SIGINT') {
                            break;
                        }
                    }
                    catch (error) {
                        const errorText = String(error instanceof Error ? error.stack || error : error);
                        logger.logGlobalEvent(`Teardown command "${command}" errored:`);
                        logger.logGlobalEvent(errorText);
                        return Promise.reject(error);
                    }
                }
            }
            finally {
                child = undefined;
                SIGNALS.forEach((signal) => process.off(signal, forwardSignal));
            }
        };
        return { commands, onFinish };
    }
}
