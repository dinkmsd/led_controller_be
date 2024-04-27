import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
class CronJobService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  getCronJobs() {
    return this.schedulerRegistry.getCronJobs();
  }

  addCronjob(
    name: string,
    cronExpression: string | Date,
    callback: () => void | Promise<void>,
  ) {
    const job = new CronJob(cronExpression, callback);

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
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
    this.schedulerRegistry.deleteCronJob(name);
  }

  safeDeleteCronjob(name: string) {
    const job = this.schedulerRegistry.getCronJobs().get(name);
    if (job) {
      this.schedulerRegistry.deleteCronJob(name);
    }
  }
}

export default CronJobService;
