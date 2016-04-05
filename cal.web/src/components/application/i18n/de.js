function de($translateProvider) {
    $translateProvider.translations('de', {
        foo: 'bar',
		
		trashAlt: 'Zum Löschen den Eintrag auf dem Mülleimer loslassen'
    });
}

export default [
    '$translateProvider',
    de
];
