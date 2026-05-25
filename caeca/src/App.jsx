import CardForm from './components/layout/CardForm'
import { Button } from './components/ui/Button'
import { InputField } from './components/ui/InputField'

function App() {
  return (
    <>
      <CardForm>
        <InputField 
          label={"Nome da peça"}
          type={"text"}
          placeholder={"Anel XYZ"}
          required={true}></InputField>
        <Button>Confirmar</Button>
      </CardForm>
    </>
  )
}

export default App
