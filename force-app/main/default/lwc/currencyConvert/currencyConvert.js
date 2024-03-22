import { LightningElement, track, wire } from 'lwc';
import getYenRatesByDate from '@salesforce/apex/getCurrencyRatesController.getYenRatesByDate';
import getPLNRatesByDate from '@salesforce/apex/getCurrencyRatesController.getPLNRatesByDate';

export default class CurrencyConverter extends LightningElement {
    @track amount;
    @track sourceCurrency;
    @track targetCurrency;
    @track convertedAmount;
    @track yenMappedRecords;
    @track plnMappedRecords;

    @wire(getYenRatesByDate)
    wiredYenRecords({ error, data }) {
        if (data) {
            this.yenMappedRecords = data.map(record => ({
                yenId: record.Id,
                yenName: record.Name,
                yenRates: record.rates__c,
                yenTimestamp: record.timestamp__c,
                yenBase: record.base__c
            }));
            console.log('yen records:' + JSON.stringify(this.yenMappedRecords));
        } else if (error) {
            console.log('error: '+ JSON.stringify(error));
        }
    }

    @wire(getPLNRatesByDate)
    wiredPLNRecords({ error, data }) {
        if (data) {
            this.plnMappedRecords = data.map(record => ({
                plnId: record.Id,
                plnName: record.Name,
                plnRates: record.rates__c,
                plnTimestamp: record.timestamp__c,
                plnBase: record.base__c
            }));
            console.log('pln records:' + JSON.stringify(this.plnMappedRecords));
        } else if (error) {
            console.log('error: '+ JSON.stringify(error));
        }
    }

    sourceCurrencyOptions = [
        { label: 'USD', value: 'USD' },
        { label: 'PLN', value: 'PLN' },
        { label: 'JPY', value: 'JPY' },
    ];

    targetCurrencyOptions = [
        { label: 'USD', value: 'USD' },
        { label: 'PLN', value: 'PLN' },
        { label: 'JPY', value: 'JPY' },
    ];

    handleAmountChange(event) {
        this.amount = event.target.value;
    }

    handleSourceCurrencyChange(event) {
        this.sourceCurrency = event.target.value;
    }

    handleTargetCurrencyChange(event) {
        this.targetCurrency = event.target.value;
    }

    handleConvert() {
        // Retrieve the rates for the specific date
        let yenRates = this.yenMappedRecords.find(record => record.yenBase === 'USD');
        let plnRates = this.plnMappedRecords.find(record => record.plnBase === 'USD');
        console.log('yen rates:' + JSON.stringify(yenRates));
    
        // Perform the currency conversion
        let convertedAmount;

        if (this.sourceCurrency === 'USD' && this.targetCurrency === 'JPY') {
            convertedAmount = (this.amount * yenRates.yenRates).toFixed(0) + ' 円';
        } else if (this.sourceCurrency === 'JPY' && this.targetCurrency === 'USD') {
            convertedAmount = (this.amount / yenRates.yenRates).toFixed(2) + ' $';
        } else if (this.sourceCurrency === 'USD' && this.targetCurrency === 'PLN') {
            convertedAmount = (this.amount * plnRates.plnRates).toFixed(2) + ' zl';
        } else if (this.sourceCurrency === 'PLN' && this.targetCurrency === 'USD') {
            convertedAmount = (this.amount / plnRates.plnRates).toFixed(2) + ' $';
        } else if (this.sourceCurrency === 'JPY' && this.targetCurrency === 'PLN') {
            convertedAmount = ((this.amount / yenRates.yenRates) * plnRates.plnRates).toFixed(2) + ' zl';
        } else if (this.sourceCurrency === 'PLN' && this.targetCurrency === 'JPY') {
            convertedAmount = ((this.amount / plnRates.plnRates) * yenRates.yenRates).toFixed(0) + ' 円';
        }
    
        // Update the converted amount
        this.convertedAmount = convertedAmount;
    }
}