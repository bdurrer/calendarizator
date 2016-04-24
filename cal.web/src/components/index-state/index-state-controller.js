class IndexStateController {
    constructor(authService, GData, $log) {
        this.authService = authService;
        this.$log = $log;
        
        this.jokes = [
            'Geht eine schwangere Frau in eine Bäckerei und sagt: "Ich krieg ein Brot"<br>Darauf der Bäcker: "Sachen gibt´s!',
            'Ein Mann und eine Frau sitzen zusammen im Restaurant.<br>Plötzlich bekleckert sich der Mann und sagt: "Jetzt sehe ich ja aus wie ein Schwein!"<br> Darauf die Frau: "Und bekleckert bist du auch noch!"',
            'Treffen sich zwei Jäger. Beide tot.',
            'Genetiv ins Wasser. Da tiv.',
            'Sagt die Null zur Acht: „Schicker Gürtel!“',
            '„Jetzt geht es rund!“ sagte der Papagei und sprang in den Ventilator.',
            'Fünf von vier Leuten können nicht rechnen!',
            'Was macht ein schwuler Adler? – Er fliegt zu seinem Horst.',
            'Zwei Kannibalen verspeisen einen Clown. Sagt der eine: „Der schmeckt aber komisch.“',
            'Letztes Jahr habe ich auf dem Flug in die Türkei meinen Sitznachbarn gefragt: „Und, was haben Sie in Spanien so alles vor?“ Sein Gesicht werde ich nie vergessen!',
            'Ein Mann geht in eine Buchhandlung und sagt: „Ich suche das Buch: Der Mann, der Herr im Haus„.<br>Die Antwort der Verkäuferin: „Märchenbücher finden Sie im 2. Stock…“',
            'In Texas wird die Leiche eines Farbigen gefunden mit 57 Einschusslöchern.<br>Meint der Sheriff: „Mein Gott, das ist ja der schlimmste Selbstmord, den ich je gesehen habe!“'
        ];
        const i = Math.floor(Math.random() * this.jokes.length);
        $log.debug(i + ' is the word');
        this.joke = this.jokes[i];
    }
}

export default [
    'authService',
    'GData',
    '$log',
    IndexStateController
];
