import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
class CronJobService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}
  private readonly logger = new Logger(CronJobService.name);

  getCronJobs() {
    return this.schedulerRegistry.getCronJobs();
  }

  addCronjob(
    name: string,
    cronExpression: string | Date,
    callback: () => void | Promise<void>,
  ) {
    this.logger.log(`[addCronjob] Job name: ${name}`);
    const job = this.schedulerRegistry.getCronJobs().get(name);
    if (!job) {
      const job = new CronJob(cronExpression, callback);
      this.schedulerRegistry.addCronJob(name, job);
      job.start();
    }
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   * exec and delete right after it's done
   */
  addCronjobOnce(
    name: string,
    cronExpression: string | Date,
    callback: () => void | Promise<void>,
  ) {
    const job = new CronJob(cronExpression, async () => {
      await callback();
      this.safeDeleteCronjob(name);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  deleteCronjob(name: string) {
    this.logger.log(`[deleteCronjob] Delete ${name}`);
    this.schedulerRegistry.deleteCronJob(name);
  }

  safeDeleteCronjob(name: string) {
    this.logger.log(`[safeDeleteCronjob] Delete ${name}`);

    const job = this.schedulerRegistry.getCronJobs().get(name);
    if (job) {
      this.schedulerRegistry.deleteCronJob(name);
    }
  }
}

export default CronJobService;
