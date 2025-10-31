document.addEventListener('DOMContentLoaded', function() {
    const chatbotMessages = document.getElementById('chatbot-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    let currentMenu = 'main';

    // Mensaje de bienvenida
    addMessage('¡Hola! ¿En qué puedo ayudarte?', 'bot');
    addMessage(`Por favor elige una opción:\n\n1. Línea de telefonía\n2. Consultas sobre TV e Internet\n3. Área de ventas`, 'bot');

    // Función para agregar mensajes al chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.innerHTML = text.replace(/\n/g, '<br>');
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Función para normalizar texto
    function normalizeText(text) {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s]|_/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    // Función para generar número de contrato aleatorio
    function generateContractNumber() {
        return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    }

    // Base de datos simulada de clientes
    const clientDatabase = {
        '6833526': {
            name: 'Rodrigo Vitor',
            billAmount: '220.000 GS',
            dueDate: '30/11/25'
        },
        '1234567': {
            name: 'Ana Martinez', 
            billAmount: '180.000 GS',
            dueDate: '25/11/25'
        },
        '7654321': {
            name: 'Carlos Lopez',
            billAmount: '250.000 GS', 
            dueDate: '28/11/25'
        }
    };

    // Base de datos de saldos de telefonía
    const phoneBalanceDatabase = {
        '6833526': {
            balance: '2.000.000 GS',
            benefits: 'Llamadas y mensajes ilimitados a todo país, 30 Gb y WhatsApp gratis'
        },
        '0972727253': {
            balance: '1.500.000 GS',
            benefits: 'Llamadas y mensajes ilimitados a todo país, 25 Gb y WhatsApp gratis'
        },
        '1234567': {
            balance: '800.000 GS',
            benefits: 'Llamadas y mensajes ilimitados a todo país, 20 Gb y WhatsApp gratis'
        }
    };

    // Función para manejar el envío de mensajes
    function handleSend() {
        const text = userInput.value.trim();
        if (text === '') return;

        addMessage(text, 'user');
        userInput.value = '';

        const normalizedText = normalizeText(text);
        let botResponse = '';
        let nextMenu = currentMenu;

        // Lógica del chatbot
        switch (currentMenu) {
            case 'main':
                if (normalizedText === '1') {
                    botResponse = `Línea de Telefonía - Elige una opción:\n\n1. Monto de tu factura (mensaje al 131 con tu nro de cédula)\n2. Consulta sobre saldo y factura\n3. Suspensión de línea\n4. Hablar con un representante\n0. Volver al menú principal`;
                    nextMenu = 'telefonia';
                } else if (normalizedText === '2') {
                    botResponse = `TV e Internet - Elige una opción:\n\n1. Monto y vencimiento de factura\n2. Número de contrato\n3. Soporte técnico\n4. Consultas administrativas\n0. Volver al menú principal`;
                    nextMenu = 'tv_internet';
                } else if (normalizedText === '3') {
                    botResponse = `Área de Ventas - Elige una opción:\n\n1. Planes de Telefonía\n2. Planes de Internet\n3. Planes de Internet+TV\n0. Volver al menú principal`;
                    nextMenu = 'ventas';
                } else {
                    botResponse = 'Opción no válida. Por favor elige 1, 2 o 3.';
                }
                break;

            case 'telefonia':
                if (normalizedText === '1') {
                    botResponse = 'Para consultar el monto de tu factura, envía un mensaje al 131 con tu número de cédula.';
                } else if (normalizedText === '2') {
                    botResponse = 'Para consultar tu saldo, ingresa tu número de cédula (7 dígitos) o tu número de teléfono (10 dígitos):';
                    nextMenu = 'consultar_saldo';
                } else if (normalizedText === '3') {
                    botResponse = 'Para suspensión de línea, contacta con nuestro departamento administrativo al 021-123456.';
                } else if (normalizedText === '4') {
                    botResponse = 'Conectando con un representante... Por favor espere.';
                    // Simular conexión con representante después de 2 segundos
                    setTimeout(() => {
                        addMessage('Buenas tardes, le saluda Lourdes del área de telefonía. ¿En qué le puedo ayudar?', 'bot');
                    }, 2000);
                } else if (normalizedText === '0') {
                    botResponse = `Menú Principal:\n\n1. Línea de telefonía\n2. Consultas sobre TV e Internet\n3. Área de ventas`;
                    nextMenu = 'main';
                } else {
                    botResponse = 'Opción no válida. Elige 1, 2, 3, 4 o 0 para volver.';
                }
                break;

            case 'consultar_saldo':
                if (/^\d{7}$/.test(normalizedText) || /^\d{10}$/.test(normalizedText)) {
                    const clientData = phoneBalanceDatabase[normalizedText];
                    if (clientData) {
                        botResponse = `El saldo de la línea ${normalizedText} es de ${clientData.balance}.\n\nIncluye:\n- ${clientData.benefits}`;
                    } else {
                        botResponse = `El saldo de la línea ${normalizedText} es de 1.200.000 GS.\n\nIncluye:\n- Llamadas y mensajes ilimitados a todo país\n- 25 Gb de datos\n- WhatsApp gratis`;
                    }
                    nextMenu = 'telefonia';
                } else {
                    botResponse = 'Número inválido. Debe ser un número de cédula de 7 dígitos o un número de teléfono de 10 dígitos. Intenta nuevamente:';
                }
                break;

            case 'tv_internet':
                if (normalizedText === '1') {
                    botResponse = 'Para consultar monto y vencimiento de tu factura, ingresa tu número de cédula o RUC (7 dígitos):';
                    nextMenu = 'consultar_factura';
                } else if (normalizedText === '2') {
                    botResponse = 'Para obtener tu número de contrato, ingresa tu número de cédula (7 dígitos):';
                    nextMenu = 'obtener_contrato';
                } else if (normalizedText === '3') {
                    botResponse = `Soporte Técnico - Elige una opción:\n\n1. Inconvenientes técnicos de TV\n2. Inconvenientes técnicos de Internet\n0. Volver al menú anterior`;
                    nextMenu = 'soporte_tecnico';
                } else if (normalizedText === '4') {
                    botResponse = `Consultas Administrativas:\n\n1. Cambio de domicilio\n2. Baja del servicio\n3. Actualización de datos\n4. Facturación y pagos\n0. Volver al menú anterior`;
                    nextMenu = 'consultas_administrativas';
                } else if (normalizedText === '0') {
                    botResponse = `Menú Principal:\n\n1. Línea de telefonía\n2. Consultas sobre TV e Internet\n3. Área de ventas`;
                    nextMenu = 'main';
                } else {
                    botResponse = 'Opción no válida. Elige 1, 2, 3, 4 o 0 para volver.';
                }
                break;

            case 'consultar_factura':
                if (/^\d{7}$/.test(normalizedText)) {
                    const clientData = clientDatabase[normalizedText];
                    if (clientData) {
                        botResponse = `Cliente: ${clientData.name}\nMonto de factura: ${clientData.billAmount}\nFecha de vencimiento: ${clientData.dueDate}`;
                    } else {
                        botResponse = 'No se encontró información para el número ingresado. Verifica e intenta nuevamente.';
                    }
                    nextMenu = 'tv_internet';
                } else {
                    botResponse = 'Número inválido. Debe contener exactamente 7 dígitos. Intenta nuevamente:';
                }
                break;

            case 'obtener_contrato':
                if (/^\d{7}$/.test(normalizedText)) {
                    const contractNumber = generateContractNumber();
                    botResponse = `Ingrese numero de CI: ${normalizedText}\n\nTu número de contrato es: ${contractNumber}\n\n¿En qué más puedo ayudarte?`;
                    nextMenu = 'tv_internet';
                } else {
                    botResponse = 'Número inválido. Debe contener exactamente 7 dígitos. Intenta nuevamente:';
                }
                break;

            case 'soporte_tecnico':
                if (normalizedText === '1') {
                    botResponse = `Problemas de TV - Elige tu inconveniente:\n\n1. Sin señal\n2. No aparecen algunos canales\n3. Pantalla negra\n4. Problemas de audio\n0. Volver`;
                    nextMenu = 'problemas_tv';
                } else if (normalizedText === '2') {
                    botResponse = `Problemas de Internet - Elige tu inconveniente:\n\n1. Sin conexión\n2. Conexión lenta\n3. Intermitencia de señal\n4. Problemas con WiFi\n0. Volver`;
                    nextMenu = 'problemas_internet';
                } else if (normalizedText === '0') {
                    botResponse = `TV e Internet - Elige una opción:\n\n1. Monto y vencimiento de factura\n2. Número de contrato\n3. Soporte técnico\n4. Consultas administrativas`;
                    nextMenu = 'tv_internet';
                } else {
                    botResponse = 'Opción no válida. Elige 1, 2 o 0 para volver.';
                }
                break;

            case 'problemas_tv':
                if (['1', '2', '3', '4'].includes(normalizedText)) {
                    botResponse = 'Le vamos a direccionar con un asesor técnico especializado. Por favor espere...';
                    setTimeout(() => {
                        addMessage('Buenas tardes, le saluda Javier del área de soporte técnico de TV. ¿En qué le puedo ayudar?', 'bot');
                    }, 2000);
                    nextMenu = 'tv_internet';
                } else if (normalizedText === '0') {
                    botResponse = `Soporte Técnico - Elige una opción:\n\n1. Inconvenientes técnicos de TV\n2. Inconvenientes técnicos de Internet`;
                    nextMenu = 'soporte_tecnico';
                } else {
                    botResponse = 'Opción no válida. Elige 1, 2, 3, 4 o 0 para volver.';
                }
                break;

            case 'problemas_internet':
                if (['1', '2', '3', '4'].includes(normalizedText)) {
                    botResponse = 'Le vamos a direccionar con un asesor técnico especializado. Por favor espere...';
                    setTimeout(() => {
                        addMessage('Buenas tardes, le saluda Patricia del área de soporte técnico de Internet. ¿En qué le puedo ayudar?', 'bot');
                    }, 2000);
                    nextMenu = 'tv_internet';
                } else if (normalizedText === '0') {
                    botResponse = `Soporte Técnico - Elige una opción:\n\n1. Inconvenientes técnicos de TV\n2. Inconvenientes técnicos de Internet`;
                    nextMenu = 'soporte_tecnico';
                } else {
                    botResponse = 'Opción no válida. Elige 1, 2, 3, 4 o 0 para volver.';
                }
                break;

            case 'consultas_administrativas':
                if (['1', '2', '3', '4'].includes(normalizedText)) {
                    botResponse = 'Le vamos a direccionar con un asesor administrativo. Por favor espere...';
                    setTimeout(() => {
                        addMessage('Buenas tardes, le saluda Laura del área administrativa. ¿En qué le puedo ayudar?', 'bot');
                    }, 2000);
                    nextMenu = 'tv_internet';
                } else if (normalizedText === '0') {
                    botResponse = `TV e Internet - Elige una opción:\n\n1. Monto y vencimiento de factura\n2. Número de contrato\n3. Soporte técnico\n4. Consultas administrativas`;
                    nextMenu = 'tv_internet';
                } else {
                    botResponse = 'Opción no válida. Elige 1, 2, 3, 4 o 0 para volver.';
                }
                break;

            case 'ventas':
                if (normalizedText === '1') {
                    botResponse = `Planes de Telefonía - Elige una opción:\n\n1. Plan móvil 25 GB - 100.000 GS/mes\n2. Plan móvil 40 GB - 140.000 GS/mes\n3. Plan móvil 70 GB - 170.000 GS/mes\n4. Plan móvil 150 GB - 250.000 GS/mes\n0. Volver al menú anterior`;
                    nextMenu = 'planes_telefonia';
                } else if (normalizedText === '2') {
                    botResponse = `Planes de Internet - Elige una opción:\n\n1. Wifi ilimitado 200 Mbps - 170.000 GS\n2. Wifi ilimitado 300 Mbps - 220.000 GS\n3. Wifi ilimitado 400 Mbps - 280.000 GS\n4. Wifi ilimitado 600 Mbps - 340.000 GS\n0. Volver al menú anterior`;
                    nextMenu = 'planes_internet';
                } else if (normalizedText === '3') {
                    botResponse = `Planes de Internet+TV - Elige una opción:\n\n1. Wifi ilimitado 300 Mbps + TV + 3 meses Disney+ - 255.000 GS\n2. Wifi ilimitado 400 Mbps + TV + 3 meses Disney+ - 305.000 GS\n3. Wifi ilimitado 600 Mbps + TV + 3 meses Disney+ - 365.000 GS\n4. Wifi ilimitado 800 Mbps + TV + 3 meses Disney+ - 455.000 GS\n0. Volver al menú anterior`;
                    nextMenu = 'planes_internet_tv';
                } else if (normalizedText === '0') {
                    botResponse = `Menú Principal:\n\n1. Línea de telefonía\n2. Consultas sobre TV e Internet\n3. Área de ventas`;
                    nextMenu = 'main';
                } else {
                    botResponse = 'Opción no válida. Elige 1, 2, 3 o 0 para volver.';
                }
                break;

            case 'planes_telefonia':
                if (['1', '2', '3', '4'].includes(normalizedText)) {
                    const planes = {
                        '1': 'Plan móvil 25 GB',
                        '2': 'Plan móvil 40 GB', 
                        '3': 'Plan móvil 70 GB',
                        '4': 'Plan móvil 150 GB'
                    };
                    botResponse = `Has elegido el ${planes[normalizedText]}. Un asesor de ventas se contactará contigo para finalizar la contratación.`;
                    setTimeout(() => {
                        addMessage('Buenas tardes, le saluda Carlos del área de ventas de telefonía. ¿En qué le puedo ayudar?', 'bot');
                    }, 2000);
                    nextMenu = 'main';
                } else if (normalizedText === '0') {
                    botResponse = `Área de Ventas - Elige una opción:\n\n1. Planes de Telefonía\n2. Planes de Internet\n3. Planes de Internet+TV`;
                    nextMenu = 'ventas';
                } else {
                    botResponse = 'Opción no válida. Elige 1, 2, 3, 4 o 0 para volver.';
                }
                break;

            case 'planes_internet':
                if (['1', '2', '3', '4'].includes(normalizedText)) {
                    const planes = {
                        '1': 'Wifi ilimitado 200 Mbps',
                        '2': 'Wifi ilimitado 300 Mbps',
                        '3': 'Wifi ilimitado 400 Mbps',
                        '4': 'Wifi ilimitado 600 Mbps'
                    };
                    botResponse = `Has elegido el ${planes[normalizedText]}. Le estamos derivando a un asesor de ventas.`;
                    setTimeout(() => {
                        addMessage('Buenas tardes, le saluda Ana del área de ventas de internet. ¿En qué le puedo ayudar?', 'bot');
                    }, 2000);
                    nextMenu = 'main';
                } else if (normalizedText === '0') {
                    botResponse = `Área de Ventas - Elige una opción:\n\n1. Planes de Telefonía\n2. Planes de Internet\n3. Planes de Internet+TV`;
                    nextMenu = 'ventas';
                } else {
                    botResponse = 'Opción no válida. Elige 1, 2, 3, 4 o 0 para volver.';
                }
                break;

            case 'planes_internet_tv':
                if (['1', '2', '3', '4'].includes(normalizedText)) {
                    const planes = {
                        '1': 'Wifi ilimitado 300 Mbps + TV + 3 meses Disney+',
                        '2': 'Wifi ilimitado 400 Mbps + TV + 3 meses Disney+',
                        '3': 'Wifi ilimitado 600 Mbps + TV + 3 meses Disney+',
                        '4': 'Wifi ilimitado 800 Mbps + TV + 3 meses Disney+'
                    };
                    botResponse = `Has elegido el ${planes[normalizedText]}. Un asesor de ventas se contactará contigo para finalizar la contratación.`;
                    setTimeout(() => {
                        addMessage('Buenas tardes, le saluda María del área de ventas de internet y TV. ¿En qué le puedo ayudar?', 'bot');
                    }, 2000);
                    nextMenu = 'main';
                } else if (normalizedText === '0') {
                    botResponse = `Área de Ventas - Elige una opción:\n\n1. Planes de Telefonía\n2. Planes de Internet\n3. Planes de Internet+TV`;
                    nextMenu = 'ventas';
                } else {
                    botResponse = 'Opción no válida. Elige 1, 2, 3, 4 o 0 para volver.';
                }
                break;

            default:
                botResponse = 'Ha ocurrido un error. Volviendo al menú principal...';
                nextMenu = 'main';
        }

        currentMenu = nextMenu;
        setTimeout(() => {
            addMessage(botResponse, 'bot');
        }, 500);
    }

    // Event listeners
    sendButton.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
});
