function de($translateProvider) {
    $translateProvider.translations('de', {
        title: 'Hurra!',
        youreventsadded: 'Deine Termine wurden eingetragen. Denke daran, deinen Kalender an deine Freunde freizugeben (siehe unten).',
        addmore: 'Du willst noch mehr Termine eintragen?',
        addacl: 'Hinzufügen',
        aclAddUserPlaceholder: 'Email Adresse'
    });
}

export default [
    '$translateProvider',
    de
];
