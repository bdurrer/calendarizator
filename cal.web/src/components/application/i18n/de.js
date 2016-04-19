function de($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('escape');
    $translateProvider.translations('de', {
        trashAlt: 'Zum Löschen den Eintrag auf dem Mülleimer loslassen',
        toggleNav: 'Navigation aus/einblenden',

        calRole: {
            freeBusyReader: 'Zusammenfassung lesen',
            owner: 'Besitzer',
            reader: 'Lesen',
            writer: 'Schreiben'
        },

        page: {
            login: 'Login',
            selectCal: 'Kalender wählen',
            createAppointments: 'Terminplan zusammenstellen'
        }
    });
}

export default [
    '$translateProvider',
    de
];
