import { useEffect, useState } from 'react'
import CardForm from './components/layout/CardForm'
import { Button } from './components/ui/Button'
import { InputField } from './components/ui/InputField'
import useFetch from './hooks/useFetch'
import { banhoApi } from './service/banhoApi'

function App() {

  const [banhos, setBanhos] = useState([]);

  useEffect(() => {
    async function buscarDados() {
      const listaTratada = await banhoApi.listarBanhos();
      setBanhos(listaTratada);
    }
    buscarDados();
  }, []);

  return (
    <>
      <CardForm>
        <InputField 
          label={"Nome da peça"}
          type={"text"}
          placeholder={"Coração XYZ"}
          required={true}>
        </InputField>
        <InputField 
          label={"Material"}
          type={"text"}
          placeholder={"XYZ"}
          required={true}>
        </InputField>
        <InputField 
          label={"Categoria"}
          type={"text"}
          placeholder={"Anel"}
          required={true}>
        </InputField>
        <InputField 
          label={"Banho"}
          type={"text"}
          placeholder={"Prata"}
          required={true}>
        </InputField>
        <InputField 
          label={"Quantidade"}
          type={"number"}
          placeholder={"15"}
          required={true}>
        </InputField>
        <InputField 
          label={"Preço original (custo)"}
          type={"number"}
          placeholder={"Anel XYZ"}
          required={true}>
        </InputField>
        <InputField 
          label={"Preço do banho"}
          type={"number"}
          placeholder={"72.24"}
          required={true}>
        </InputField>
        <InputField 
          label={"Multiplicador (Ganho)"}
          type={"number"}
          placeholder={"1.5"}
          required={true}>
        </InputField>
        <InputField 
          label={"Fornecedor"}
          type={"text"}
          placeholder={"Anel XYZ"}
          required={true}>
        </InputField>
        <InputField 
          label={"Imagem"}
          type={"text"}
          placeholder={"Anel XYZ"}
          required={false}>
        </InputField>

        <Button>Confirmar</Button>
      </CardForm>
    </>
  )
}

export default App
