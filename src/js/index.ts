import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index"

interface IAppointment {
    id: number
    firstParty: string
    secondParty: string
    topic: string
    date: Date
    duration: number
}

// 2022-02-09: Denne her skaber forbindelse til URL'en til restapi'en med tabellen med tidsbestillinger, men virker kun hvis AppointmentREST kører.
// Hvis jeg havde en cloud så var det ikke nødvendigt at køre begge programmer.
let baseUrl: string = "http://localhost:44537/api/Appointments"

new Vue({
    // TypeScript compiler complains about Vue because the CDN link to Vue is in the html file.
    // Before the application runs this TypeScript file will be compiled into bundle.js
    // which is included at the bottom of the html file.
    el: "#app",
    data: {
        appointments: [],
        topicToGetBy: "",
        updateData: { id: "", firstParty: "", secondParty: "", topic: "", date: Date, duration: 0},
        updateMessage: "",
        deleteId: 0,
        deleteMessage: "",
        addData: { firstParty: "", secondParty: "", topic: "", date: Date, duration: 0},
        addMessage: ""
    },
    methods: {
        // Gør det nemmere for Get metoder at vise værdierne, hvor den bruger axios' get-metode og URL'en, men kun med kunder.
        helperGetAndShow(url: string) {
            axios.get<IAppointment[]>(url)
                .then((response: AxiosResponse<IAppointment[]>) => {
                    this.appointments = response.data
                })
                .catch((error: AxiosError) => {
                    //this.message = error.message
                    alert(error.message) // https://www.w3schools.com/js/js_popup.asp
                })
        },
        // Henter en liste med tidsbestillinger
        getAllAppointments() {
            this.helperGetAndShow(baseUrl)
        },
        // Henter en liste med tidsbestillinger, så længer vædierne passer til det der indtastes i "topic".
        getByTopic(keyword: string) {
            let url: string = baseUrl + "/" + "topic" + "/" + keyword
            this.helperGetAndShow(url)
        },
        // Tilføjer en tidsbestilling til databasen, så længe værdierne til tidsbestillingen er sat ind, og URL'en er brugt.
        addAppointment() {
            axios.post<IAppointment>(baseUrl, this.addData)
                .then((response: AxiosResponse) => {
                    
                    let message: string = "Skabningen af ny kunde er " + response.statusText
                    this.addMessage = message
                    this.getAllAppointments()
                })
                .catch((error: AxiosError) => {
                    // this.addMessage = error.message
                    alert(error.message)
                })
        },
        // Opdater en tidsbestilling med den rigtige URL og tidsbestillingens id.
        updateAppointment() {
            let url: string = baseUrl + "/" + this.updateData.id
            axios.put<IAppointment>(url, this.updateData)
                .then((response: AxiosResponse) => {
                    let message: string = response.statusText + " tidsbestilingen er opdateret."
                    this.updateMessage = message
                    this.getAllAppointments()
                })
                .catch((error: AxiosError) => {
                    // this.addMessage = error.message
                    alert(error.message)
                })
        },
        // Sletter en tidsbestilling med et bestemt id.
        deleteAppointment(id: number) {
            let url: string = baseUrl + "/" + id
            axios.delete<void>(url)
                            .then((response: AxiosResponse<void>) => {
                    this.deleteMessage = response.statusText + " tidsbestillingen er fjernet"
                    this.getAllAppointments()
               })
                .catch((error: AxiosError) => {
                    //this.deleteMessage = error.message
                    alert(error.message)
                })
        }
    }
})