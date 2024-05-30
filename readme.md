## Readme - M3

* Gruppe:	[2]
* Team-Nr.: 205
* Projektthema: Learn Easy

### Implementierung

Framework:	[React Native Android]

API-Version:	[Android 11.0 ("R")]

GerÃ¤t(e), auf dem(denen) getestet wurde:
[Hardware: iPhone 13 mini (expo), Virtual: Pixel 3a]

Externe Libraries und Frameworks:
[

    "@react-native-async-storage/async-storage": "^1.23.1",
    "@react-native-picker/picker": "^2.7.6",
    "expo": "~51.0.2",
    "expo-checkbox": "^3.0.0",
    "expo-speech": "~12.0.2",
    "expo-status-bar": "~1.12.1",
    "react": "18.2.0",
    "react-native": "0.74.1",
    "react-native-gifted-charts": "^1.4.10",
    "react-native-linear-gradient": "^2.8.3",
    "react-native-svg": "^15.3.0",
    "react-native-table-component": "^1.2.2",
    "react-native-vector-icons": "^10.1.0"
    FontAwesome ('react-native-vector-icons/FontAwesome')

]

Dauer der Entwicklung:
[
 Tobias Schort: 40 Stunden,
]

Weitere Anmerkungen:

### card scheduling
#### interval = 1min
Die täglich zu lernenden Karten werden basierend auf dem implementierten spaced repetition algorithmus (bereits reviewed) und dem Setting `cards per day` bestimmt.
Eigentlich vorgesehen ist, dass neue Karten täglich hinzugefügt werden.
Um das Testen zu erleichtern haben wir jedoch das Intervall, welches zur bestimmung des Zeitpunktes des Hinzufügens herangezogen wird in der `topicConfigDefault` auf 1min gesetzt.
