public with sharing class getCurrencyRatesController {
    @AuraEnabled(cacheable=true)
    public static List<Daily_Yen_Exchange_Rate__c> getYenRatesByDate() {
        Date today = Date.today();
        return [SELECT Id, Name, rates__c, base__c, timestamp__c FROM Daily_Yen_Exchange_Rate__c WHERE date__c = :today];
    }
    @AuraEnabled(cacheable=true)
    public static List<Daily_PLN_Exchange_Rate__c> getPLNRatesByDate() {
        Date today = Date.today();
        return [SELECT Id, Name, rates__c, base__c, timestamp__c FROM Daily_PLN_Exchange_Rate__c WHERE date__c = :today];
    }
}