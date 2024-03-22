global with sharing class DailyScheduler implements Schedulable {
    global void execute (SchedulableContext sc) {
        System.enqueueJob(new CurrencyConvertorController());
    }
}
