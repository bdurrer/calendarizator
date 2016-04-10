function de($translateProvider) {
    $translateProvider.translations('de', {
        calendarsExisting: 'Wähle einen Kalender',
        calendarsCreateExplanation: 'Es ist empfehlenswert, einen eigenen Kalender nur für diese App zu verwenden. ' +
            'Dann kannst du ihn auch einfach wieder löschen/leeren, ' +
            'wenn was schief geht oder du ihn nicht mehr brauchst.',
        calendarsCreate: {
            title: '... oder erstelle einen neuen Kalender',
            summary: 'Kalender-Name',
            summaryPlaceholder: 'Arbeitsplan',
            location: 'Ort',
            locationPlaceholder: 'z.B. Aarau, Schweiz',
            description: 'Beschreibung',
            tz: 'Zeitzone'
        },
        calPrimary: 'Hauptkalender',
        buttonCreate: 'Erstellen',
        buttonReloadList: 'Liste neu laden',
        buttonSelectCal: 'Weiter mit gewähltem Kalender'
    });
}

export default [
    '$translateProvider',
    de
];
