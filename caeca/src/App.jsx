import { useEffect, useState } from 'react'
import CardForm from './components/layout/CardForm'
import { Button } from './components/ui/Button'
import { InputField } from './components/ui/InputField'
import useFetch from './hooks/useFetch'
import { banhoApi } from './service/banhoApi'
import { SelectField } from './components/ui/SelectField'
import { EntradaJoia } from './pages/EntradaJoia'

function App() {
  return (
    <>
      <EntradaJoia></EntradaJoia>
    </>
  )
}

export default App
