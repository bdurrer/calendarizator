function de($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
    $translateProvider.translations('de', {
        trashAlt: 'Zum Löschen den Eintrag auf dem Mülleimer loslassen',
        toggleNav: 'Navigation aus/einblenden',

        calRole: {
            freeBusyReader: 'Zusammenfassung lesen',
            owner: 'Besitzer',
            reader: 'Lesen',
            writer: 'Schreiben',
            none: 'Kein Zugriff'
        },

        acl: {
            scopeType: {
                default: 'Jedermann',
                user: 'Benutzer',
                group: 'Gruppe',
                domain: 'Domäne'
            },
            emptylist: 'Keine Freigaben'
        },

        page: {
            login: 'Login',
            selectCal: 'Kalender wählen',
            createAppointments: 'Terminplan zusammenstellen',
            index: 'Willkommen'
        },

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
            tz: 'Zeitzone',
            startDatePlaceholder: 'Datum des ersten Termins',
            startDate: 'Startdatum'
        },

        calPrimary: 'Hauptkalender',
        buttonCreate: 'Erstellen',
        buttonReloadList: 'Liste neu laden',
        buttonSelectCal: 'Weiter mit gewähltem Kalender',
        buttonCreateEvents: 'Fertig! Termine in Kalender übertragen',
        buttonClearEvents: 'Liste leeren',

        datepicker: {
            format: 'dd.MM.yyyy',
            altInputFormats: 'dd-MMMM-yyyy;yyyy/MM/dd;dd.MM.yyyy;shortDate'
        },

        weekdays: {
            n1: 'Montag',
            n2: 'Dienstag',
            n3: 'Mittwoch',
            n4: 'Donnerstag',
            n5: 'Freitag',
            n6: 'Samstag',
            n7: 'Sonntag'
        }
    });
}

export default [
    '$translateProvider',
    de
];
