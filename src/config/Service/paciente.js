
import firebase from './../Database/firebase';

export class PacienteService {

    db;
    constructor() {
        this.db = firebase.firestore().collection('paciente');
    }

    async insert(paciente) {
        return this.db.doc('xxx').set(paciente)
    }

    async update(paciente) {
        return this.db.doc(paciente.id).set(paciente, { merge: true })
    }

    async read(id) {
        return this.db.doc(id).get()
    }

    async readAll() {      
        this.db.valueChanges().subscribe((res)=> console.log(res))
    }

    async delete(id) {
        return this.db.doc(id).delete()
    }


}

