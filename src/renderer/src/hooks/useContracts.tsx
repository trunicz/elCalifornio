interface Contracts {
  createContract: (formData: object, fileName: string) => Promise<void>
  createBillPdf: (formData: object, fileName: string) => Promise<void>
}

const headersList = {
  Accept: '*/*',
  'Content-Type': 'application/json'
}

export const useContracts = (): Contracts => {
  const createContract = async (formData: object, fileName: string): Promise<void> => {
    try {
      // !Modo PROD
      // const response = await fetch('https://elcalifornioapi.techdreamscope.workers.dev/contracts', {
      //   method: 'POST',
      //   headers: headersList,
      //   body: JSON.stringify({ formData })
      // })

      const response = await fetch('http://127.0.0.1:8787/contracts', {
        method: 'POST',
        headers: headersList,
        body: JSON.stringify({ formData })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const filledPdfBytes = await response.blob()
      const blob = new Blob([filledPdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fileName}`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const createBillPdf = async (formData: object, fileName: string): Promise<void> => {
    try {
      // !Modo PROD
      // const response = await fetch('https://elcalifornioapi.techdreamscope.workers.dev/bills', {
      //   method: 'POST',
      //   headers: headersList,
      //   body: JSON.stringify({ formData })
      // })
      const response = await fetch('http://127.0.0.1:8787/bills', {
        method: 'POST',
        headers: headersList,
        body: JSON.stringify({ formData })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const filledPdfBytes = await response.arrayBuffer()
      const blob = new Blob([filledPdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fileName}`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  return {
    createContract,
    createBillPdf
  }
}
