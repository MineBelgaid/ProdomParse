import { buildStore as buildIt, inferType, Prototype } from 'prodom'
import './editor.css'
import jsSHA from 'jssha'
import axios from 'axios'
export interface EditorProps {
  demo: string
  title: string
  hash: string
}

const Editor = (
  { demo, title, hash }: EditorProps,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  {
    onDemoChange,
    setTitle,
    setHash,
    setHashFile,
    checkIntegrity,
    createKeyPair,
  }: EditorActions,
  demoProp: string,
  titleProp: string,
  link: string,
  dark: boolean,
  // hashProp: string,
) => {
  const resolvedDemo = demo !== undefined ? demo : demoProp
  const resolvedTitle = title !== undefined ? title : titleProp
  // const resolvedhash = hash !== undefined ? title : hashProp
  const titleDOM = {
    tag: 'div',
    className: ['title', dark && 'dark'],
    innerText: resolvedTitle,
  }
  // const hashDOM = {
  //   tag: 'div',
  //   className: ['hash', dark && 'dark'],
  //   innerText: resolvedhash,
  // }

  // const linkDOM = {
  //   tag: 'div',
  //   className: ['title', 'tooltip', dark && 'dark'],
  //   children: [
  //     { tag: 'span', innerText: 'edit on codepen', className: ['tooltiptext'] },
  //     {
  //       tag: 'a',
  //       href: link,
  //       className: ['link'],
  //       children: [devIcon(dark, '#666', '#bbb', 16, 16)],
  //     },
  //   ],
  // }

  const headerDOM: Prototype<HTMLDivElement> = {
    tag: 'div',
    className: ['header', dark && 'dark'],
    children: [titleDOM],
  }

  // const leftDemoDOM: Prototype<HTMLDivElement> = {
  //   tag: 'div',
  //   className: ['left-demo', dark && 'dark'],
  //   innerText: demoProp,
  //   oninput: (e: Event) => {
  //     onDemoChange((e.target as HTMLDivElement).innerText)
  //   },
  //   contentEditable: 'true',
  // }
  const DOM = inferType({
    tag: 'div',
    className: ['right-demo', dark && 'dark'],
    children: [eval('(' + resolvedDemo + ')')],
  })

  // const demoContainerDOM: Prototype<HTMLDivElement> = {
  //   tag: 'div',
  //   className: ['demo-container', dark && 'dark'],
  //   children: [DOM],
  // }
  return {
    tag: 'div',
    className: ['editor-container', dark && 'dark'],
    children: [DOM],
  }
}

async function sendMessage(message) {
  // get slug from current page url query
  const slug = window.location.search.split('=')[1]
  console.log(slug)
  const time = Date.now() / 1000
  console.log(time)

  await axios
    .post(
      'https://quiet-shelf-39279.herokuapp.com/https://prodomchat.herokuapp.com/addMessage',
      // 'http://localhost:8020/addMessage',
      {
        timestamp: time,
        message: message,
      },
      {
        // withCredentials: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Origin': 'https://prodomchat.herokuapp.com/',
        },
      },
    )
    .then((response) => {
      if (response.status === 200) {
        console.log('success')
        console.log(response.data)
        // convert all the messages objects into strings and change the div with the id messages by the new messages
        // convert the timestamp to a date
        const messages = response.data
          .map(function (message) {
            const date = timeConverter(message.timestamp)
            const user = message.sender
            // format the string to be aligned
            let messageString = ''
            message.message.split('.').forEach((message) => {
              messageString += `${date} ${user}: ${message}` + '<br>'
            })
            // remove the last <br>
            messageString = messageString.slice(0, -4)
            return messageString
          })
          .join('<br>')
        document.getElementById('messages').innerHTML = messages
      }
    })
}

function timeConverter(UNIX_timestamp) {
  const a = new Date(UNIX_timestamp * 1000)
  // const months = [
  //   'Jan',
  //   'Feb',
  //   'Mar',
  //   'Apr',
  //   'May',
  //   'Jun',
  //   'Jul',
  //   'Aug',
  //   'Sep',
  //   'Oct',
  //   'Nov',
  //   'Dec',
  // ]
  // const year = a.getFullYear()
  // const month = months[a.getMonth()]
  // const date = a.getDate()
  const hour = a.getHours()
  const min = a.getMinutes()
  const sec = a.getSeconds()
  const time = hour + ':' + min + ':' + sec
  // const time =
  //   date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec
  return time
}
type EditorActions = {
  onDemoChange: (demo: string) => void
  setTitle: (title: string) => void
  setHash: (str: string) => void
  setHashFile: (file: any, mail: string) => void
  checkIntegrity: (file: any, hash: string) => void
  createKeyPair: () => void
  // getKey: (userId: string) => void
}
const actions = (state: EditorProps): EditorActions => ({
  onDemoChange: (demo: string) => {
    state.demo = demo
  },
  setTitle: (title: string) => {
    state.title = title
  },
  setHash: (str: string) => {
    const sha512 = new jsSHA('SHA3-512', 'TEXT')
    sha512.update(str)
    state.title = 'y4e'
  },
  setHashFile: async (file: any, mail: string) => {
    await calculate_sha512_for_file(file, mail, true).then((hash) => {
      state.title = 'SHA3-512 for this file is: ' + (hash as string)
    })
  },
  checkIntegrity: async (file: any, hash: string) => {
    await calculate_sha512_for_file(file, hash).then((result) => {
      if (hash === (result as string)) {
        console.log('file is ok')
        state.title = 'File is ok '
      } else {
        console.log('file is not ok')
        state.title = 'File is not ok '
      }
    })
  },
  createKeyPair: async () => {
    // 4096 is the key size of the keypair
    await window.crypto.subtle
      .generateKey(
        // {
        //   name: 'RSA-OAEP',
        //   modulusLength: 4096, // can be 1024, 2048 or 4096
        //   publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        //   hash: { name: 'SHA-512' }, // or SHA-512
        // },
        // true,
        signAlgorithm,
        true,
        ['sign', 'verify'],
      )
      .then(function (keyPair) {
        exportPemKeys(keyPair)
          .then(function (keys) {
            document.getElementById('key-pair-info').innerText =
              JSON.stringify(keys.publicKey) +
              '\n' +
              JSON.stringify(keys.privateKey)
            // save keys to local storage
            saveKeys('55', keys.publicKey, keys.privateKey)
            localStorage.setItem('publicKey', JSON.stringify(keys.publicKey))
            // console.log(localStorage.getItem('publicKey'));
            localStorage.setItem('privateKey', JSON.stringify(keys.privateKey))

            console.log(JSON.stringify(keys.publicKey))
            // console.log(JSON.stringify(keys.privateKey))
            signData(keyPair.privateKey, 'test').then((sig) => {
              console.log(arrayBufferToBase64(sig))
              testVerifySig(
                keyPair.publicKey,
                sig,
                textToArrayBuffer('test'),
              ).then((signedData) => {
                console.log(signedData)
              })
            })
          })
          .catch(function (err) {
            console.log(err)
          })
      })
  },
})

export default buildIt(Editor, actions)
// function textToArrayBuffer(str) {
//   const buf = unescape(encodeURIComponent(str))
//   const bufView = new Uint8Array(buf.length)
//   for (let i = 0; i < buf.length; i++) {
//     bufView[i] = buf.charCodeAt(i)
//   }
//   return bufView
// }

// function base64StringToArrayBuffer(b64str) {
//   const byteStr = atob(b64str)
//   const bytes = new Uint8Array(byteStr.length)
//   for (let i = 0; i < byteStr.length; i++) {
//     bytes[i] = byteStr.charCodeAt(i)
//   }
//   return bytes.buffer
// }
// function arrayBufferToBase64String(arrayBuffer) {
//   const byteArray = new Uint8Array(arrayBuffer)
//   let byteString = ''
//   for (let i = 0; i < byteArray.byteLength; i++) {
//     byteString += String.fromCharCode(byteArray[i])
//   }
//   return btoa(byteString)
// }

// function convertBinaryToPem(binaryData, label) {
//   const base64Cert = arrayBufferToBase64String(binaryData)
//   let pemCert = '-----BEGIN ' + label + '-----\r\n'
//   let nextIndex = 0
//   let lineLength
//   while (nextIndex < base64Cert.length) {
//     if (nextIndex + 64 <= base64Cert.length) {
//       pemCert += base64Cert.substr(nextIndex, 64) + '\r\n'
//     } else {
//       pemCert += base64Cert.substr(nextIndex) + '\r\n'
//     }
//     nextIndex += 64
//   }
//   pemCert += '-----END ' + label + '-----\r\n'
//   return pemCert
// }
// function convertPemToBinary(pem) {
//   const lines = pem.split('\n')
//   let encoded = ''
//   for (let i = 0; i < lines.length; i++) {
//     if (
//       lines[i].trim().length > 0 &&
//       lines[i].indexOf('-BEGIN RSA PRIVATE KEY-') < 0 &&
//       lines[i].indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
//       lines[i].indexOf('-END RSA PRIVATE KEY-') < 0 &&
//       lines[i].indexOf('-END RSA PUBLIC KEY-') < 0
//     ) {
//       encoded += lines[i].trim()
//     }
//   }
//   return base64StringToArrayBuffer(encoded)
// }

// function exportPublicKey(keys) {
//   return new Promise(function (resolve) {
//     window.crypto.subtle
//       .exportKey('spki', keys.publicKey)
//       .then(function (spki) {
//         resolve(convertBinaryToPem(spki, 'RSA PUBLIC KEY'))
//       })
//   })
// }

// function exportPrivateKey(keys) {
//   return new Promise(function (resolve) {
//     const expK = window.crypto.subtle.exportKey('pkcs8', keys.privateKey)
//     expK.then(function (pkcs8) {
//       resolve(convertBinaryToPem(pkcs8, 'RSA PRIVATE KEY'))
//     })
//   })
// }

// function exportPemKeys(keys) {
//   return new Promise(function (resolve) {
//     exportPublicKey(keys).then(function (pubKey) {
//       exportPrivateKey(keys).then(function (privKey) {
//         resolve({ publicKey: pubKey, privateKey: privKey })
//       })
//     })
//   })
// }
// function importPublicKey(pemKey) {
//   return new Promise(function (resolve) {
//     const importer = window.crypto.subtle.importKey(
//       'spki',
//       convertPemToBinary(pemKey),
//       signAlgorithm,
//       true,
//       ['verify'],
//     )
//     importer.then(function (key) {
//       resolve(key)
//     })
//   })
// }

// function importPrivateKey(pemKey) {
//   return new Promise(function (resolve) {
//     const importer = window.crypto.subtle.importKey(
//       'pkcs8',
//       convertPemToBinary(pemKey),
//       signAlgorithm,
//       true,
//       ['sign'],
//     )
//     importer.then(function (key) {
//     import value from './../import-png';
// resolve(key)
//     })
//   })
// }
// end of Crypto functions
