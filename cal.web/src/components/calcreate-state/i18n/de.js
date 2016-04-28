/* eslint-disable max-len */
function de($translateProvider) {
    $translateProvider.translations('de', {
        intro: {
            start: 'Hi!\n\n Diese kleine Einführung soll dir zeigen, wie das Ganze funktioniert. Keinen Angst, du wirst es nur ein einziges mal sehen. Ausser du klickst später nochmals auf dieses Fragezeichen.',
            templates: 'Das sind deine Terminvorlagen.',
            yourevents: 'Hier stellst du deinen Plan zusammen. Schauen wir uns das mal genauer an...',
            youreventdate: 'Du musst nur das Datum des ersten Termines angeben.\n Die Daten für die nachfolgenden Termine kann die App selber berechnen. \nDer Wahnsinn, oder?',
            youreventslist: 'Klicke und halte Einträge aus den Terminvorlagen mit der Maus und ziehe sie hierhin. \n Wenn du die Maus loslässt, wird der Termin an dieser Stelle eingefügt. \n Du kannst die Termine auch umsortieren, indem du sie einfach mit der Maus nach oben/unten schiebst.',
            trash: 'Um ein Element in deinen Plan loszuwerden, kannst du es einfach auf den Abfalleimer ziehen.',
            saveButton: 'Wenn dein Plan komplett ist klickst du auf den dicken fetten Knopf - wo denn sonst! Damit werden die Termine in deinen Kalender übertragen.',
            generalinfopanel: 'Hier siehst du Informationen über den Kalender, den du als Ziel ausgewählt hast. \n Beispielsweise an wen du den Kalender freigegeben hast.\n\nDas wars schon, los geht´s!',

            buttons: {
                nextLabel: 'Weiter',
                prevLabel: 'Zurück',
                skipLabel: 'Intro abbrechen',
                doneLabel: 'Fertig'
            }
        }
    });
}
/* eslint-enable max-len */

export default [
    '$translateProvider',
    de
];
