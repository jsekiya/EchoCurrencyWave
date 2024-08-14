public with sharing class CurrencyConvertorController implements Queueable, Database.AllowsCallouts {
  
    @future(callout=true)
    public static void convertAndSave() {
        HttpRequest req = new HttpRequest();
        HttpResponse res = new HttpResponse();
        Http http = new Http();

        req.setEndpoint('https://api.apilayer.com/exchangerates_data/latest?symbols=JPY,PLN&base=USD');
        req.setMethod('GET');
        req.setHeader('apikey', '************');
        res = http.send(req);
        Map<string, object> responseMap = (Map<string, object>) JSON.deserializeUntyped(res.getbody());

        System.debug('responseMap: ' + responseMap);

        // Extract the necessary data from the responseMap
        Map<string, object> ratesMap = (Map<string, object>) responseMap.get('rates');
        double yenRate = (double) ratesMap.get('JPY');
        double plnRate = (double) ratesMap.get('PLN');
        long timestamp = (long) responseMap.get('timestamp');
        String baseCurrency = (String) responseMap.get('base');

        // Create a new instance of the custom object
        Daily_Yen_Exchange_Rate__c exchangeRateRecord = new Daily_Yen_Exchange_Rate__c();
        exchangeRateRecord.date__c = Date.today();
        exchangeRateRecord.rates__c = yenRate;
        exchangeRateRecord.timestamp__c = timestamp;
        exchangeRateRecord.base__c = baseCurrency;

        // Insert the custom object record into Salesforce
        insert exchangeRateRecord;

        // Create a new instance of the custom object for PLN
        Daily_PLN_Exchange_Rate__c plnExchangeRateRecord = new Daily_PLN_Exchange_Rate__c();
        plnExchangeRateRecord.date__c = Date.today();
        plnExchangeRateRecord.rates__c = plnRate;
        plnExchangeRateRecord.timestamp__c = timestamp;
        plnExchangeRateRecord.base__c = baseCurrency;

        // Insert the custom object record for PLN into Salesforce
        insert plnExchangeRateRecord;
    }

    public void execute(QueueableContext context) {
        convertAndSave();
    }
}
