import React from 'react'
import {db} from '../firebase'
import moment from 'moment';
import 'moment/locale/es';


const Firestore = (props) => {

    const [tareas, setTareas] = React.useState([])
    const [tarea, setTarea] = React.useState('')
    const [modoEdicion, setModoEdicion] = React.useState(false)
    const [id, setId] = React.useState('')

    const [ultimo, setUltimo] = React.useState(null)
    const [desactivar, setDesactivar] = React.useState(false)
  
  
    React.useEffect(() => {
  
      const obtenerDatos = async () => {
  
        try {

          setDesactivar(true)
  
          const data = await db.collection(props.user.uid)
         /*  .orderBy('fecha','desc') */
          .orderBy('fecha')
          .limit(2)
          .get()
          const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          setUltimo(data.docs[data.docs.length - 1])

          console.log(arrayData)
          setTareas(arrayData)

          const query = await db.collection(props.user.uid)
          .orderBy('fecha')
          .startAfter(data.docs[data.docs.length - 1])
          .limit(2)
          .get()
          if(query.empty){
            console.log('No hay mas documentos')
            setDesactivar(true)
          } else{
            setDesactivar(false)
          }
        } catch (error) {
          console.log(error)
        }
  
      }
  
      obtenerDatos()
  
    }, [props.user.uid])

    const siguiente = async () => {
      setDesactivar(true)
      try {
          const data = await db.collection(props.user.uid)
              .limit(2)
              .orderBy('fecha')
              .startAfter(ultimo)  
              .get()
          
          setUltimo(data.docs[data.docs.length - 1])
  
          const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          if(arrayData.length !== 0){
              setTareas([...tareas, ...arrayData])
          }
  
          const query = await db.collection(props.user.uid)
              .limit(2)
              .orderBy('fecha')
              .startAfter(data.docs[data.docs.length - 1])  
              .get()
  
          if(query.empty){
              console.log('no hay más...')
              setDesactivar(true)
          }else{
              setDesactivar(false)
          }
  
      } catch (error) {
          console.log(error)
      }
  }
  
    const agregar = async (e) => {
      e.preventDefault()
  
      if(!tarea.trim()){
        console.log('está vacio')
        return
      }
  
      try {
  
        const nuevaTarea = {
          name: tarea,
          fecha: Date.now()
        }
        const data = await db.collection(props.user.uid).add(nuevaTarea)
  
        setTareas([
          ...tareas,
          {...nuevaTarea, id: data.id}
        ])
  
        setTarea('')
        
      } catch (error) {
        console.log(error)
      }
  
      console.log(tarea)
    }
  
    const eliminar = async (id) => {
      try {
        
        await db.collection(props.user.uid).doc(id).delete()
  
        const arrayFiltrado = tareas.filter(item => item.id !== id)
        setTareas(arrayFiltrado)
  
      } catch (error) {
        console.log(error)
      }
    }
  
    const activarEdicion = (item) => {
      setModoEdicion(true)
      setTarea(item.name)
      setId(item.id)
    }
  
    const editar = async (e) => {
      e.preventDefault()
      if(!tarea.trim()){
        console.log('vacio')
        return
      }
      try {
        
        await db.collection(props.user.uid).doc(id).update({
          name: tarea
        })
        const arrayEditado = tareas.map(item => (
          item.id === id ? {id: item.id, fecha: item.fecha, name: tarea} : item
        ))
        setTareas(arrayEditado)
        setModoEdicion(false)
        setTarea('')
        setId('')
      } catch (error) {
        console.log(error)
      }
    }

    return (
        <div>
            <div className="row">
                <div className="col-md-6">
                    <h3>Lista de tareas</h3>
                    <ul className="list-group">
                        {
                        tareas.map(item => (
                            <li className="list-group-item" key={item.id}>
                            {item.name} -{moment(item.fecha).format('LLL')}
                            <button 
                                className="btn btn-danger btn-sm float-right form-control mt-2"
                                onClick={() => eliminar(item.id)}
                            >
                                Eliminar
                            </button>
                            <button 
                                className="btn btn-warning btn-sm float-right mr-2 form-control mt-2"
                                onClick={() => activarEdicion(item)}
                            >
                                Editar
                            </button>
                            </li>
                        ))
                        }
                    </ul>
                    
                    <button 
                        className="btn btn-block btn-sm mt-2 btn-info"
                        disabled={desactivar}
                        onClick={() => siguiente()}
                    >
                        Más tareas...
                    </button>
                    
                </div>
                <div className="col-md-6">
                    <h3>
                        {
                        modoEdicion ? 'Editar Tarea' : 'Agregar Tarea'
                        }
                    </h3>
                    <form onSubmit={modoEdicion ? editar : agregar}>
                        <input 
                        type="text"
                        placeholder="Ingrese tarea"
                        className="form-control mb-2"
                        onChange={e => setTarea(e.target.value)}
                        value={tarea}
                        />
                        <button 
                        className={
                            modoEdicion ? 'btn btn-warning btn-block form-control mt-2' : 'btn btn-dark btn-block form-control mt-2'
                        }
                        type="submit"
                        >
                        {
                            modoEdicion ? 'Editar' : 'Agregar'
                        }
                        </button>
                    </form>
                </div>
            </div> 
        </div>
    )
}

export default Firestore