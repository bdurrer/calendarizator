function de($translateProvider) {
	$translateProvider.useSanitizeValueStrategy('escape');
    $translateProvider.translations('de', {
		trashAlt: 'Zum Löschen den Eintrag auf dem Mülleimer loslassen'
    });
}

export default [
    '$translateProvider',
    de
];
