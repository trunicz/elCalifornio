import axios from 'axios'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PDFDocument } from 'pdf-lib'

const app = new Hono()

app.use(
  '/bills',
  cors({
    origin: '*'
  })
)
app.use(
  '/contracts',
  cors({
    origin: '*'
  })
)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/bills', async (c) => {
  try {
    const { formData } = await c.req.json()
    const pdfUrl =
      'https://kbwswwnpmbkmgzeqxyuv.supabase.co/storage/v1/object/public/pdfs/recibo.pdf'
    const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' })
    const pdfBytes = new Uint8Array(response.data)
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const contract = pdfDoc.getForm()

    for (const fieldName of Object.keys(formData)) {
      const field = contract.getTextField(fieldName)
      if (field) {
        field.setText(`${formData[fieldName]}`)
      } else {
        console.log(`Campo "${fieldName}" no encontrado en el PDF`)
      }
    }

    const pdfBytesModified = await pdfDoc.save()
    return c.body(new Uint8Array(pdfBytesModified), 200, {
      'Content-Type': 'application/pdf'
    })
  } catch (error) {
    console.log('Error al llenar el PDF', error)
    return c.text('Error al llenar el PDF ' + error, 500)
  }
})

app.post('/contracts', async (c) => {
  try {
    const { formData } = await c.req.json()
    const pdfUrl =
      'https://kbwswwnpmbkmgzeqxyuv.supabase.co/storage/v1/object/public/pdfs/contract_.pdf'
    const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' })
    const pdfBytes = new Uint8Array(response.data)
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const contract = pdfDoc.getForm()

    for (const fieldName of Object.keys(formData)) {
      if (typeof formData[fieldName] === 'boolean') {
        const checkBoxField = contract.getCheckBox(fieldName)
        if (checkBoxField) {
          if (formData[fieldName]) {
            checkBoxField.check()
          } else {
            checkBoxField.uncheck()
          }
        } else {
          console.log(`Campo "${fieldName}" no encontrado como casilla de verificación en el PDF`)
        }
      } else {
        const field = contract.getTextField(fieldName)
        if (field) {
          field.setText(`${formData[fieldName]}`)
        } else {
          console.log(`Campo "${fieldName}" no encontrado en el PDF`)
        }
      }
    }

    const pdfBytesModified = await pdfDoc.save()
    return c.body(new Uint8Array(pdfBytesModified), 200, {
      'Content-Type': 'application/pdf'
    })
  } catch (error) {
    console.log('Error al llenar el PDF', error)
    return c.text('Error al llenar el PDF', 500)
  }
})

export default app
