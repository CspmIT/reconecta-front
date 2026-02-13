import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineBluetoothConnected, MdOutlineBluetoothDisabled } from "react-icons/md";
import Swal from "sweetalert2";

const BluetoothConnector = () => {
  const [deviceName, setDeviceName] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [device, setDevice] = useState(null);
  const [receivedData, setReceivedData] = useState("");
  const [rxCharacteristic, setRxCharacteristic] = useState(null);
  const [txCharacteristic, setTxCharacteristic] = useState(null);

  const SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
  const CHARACTERISTIC_UUID_RX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
  const CHARACTERISTIC_UUID_TX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

  const waitingForConfirmation = useRef(false);
  const confirmationTimeout = useRef(null);

  useEffect(() => {
    if (device) {
      device.addEventListener("gattserverdisconnected", handleDisconnect);
      return () => {
        device.removeEventListener("gattserverdisconnected", handleDisconnect);
      };
    }
  }, [device]);

  useEffect(() => {
    if (isConnected && rxCharacteristic) {
      probarComunicacion();
    }
  }, [isConnected, rxCharacteristic]);

  const connectToDevice = async () => {
    try {
      const selectedDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [SERVICE_UUID],
      });

      setDeviceName(selectedDevice.name);
      setDevice(selectedDevice);
      await connectToGatt(selectedDevice);
      setIsConnected(true);
    } catch (error) {
      console.error("Error en la conexión GATT:", error);
      if (error.message.includes("User cancelled")) return;
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo conectar al dispositivo.",
      });
    }
  };

  const connectToGatt = async (selectedDevice) => {
    try {
      const server = await selectedDevice.gatt.connect();
      const service = await server.getPrimaryService(SERVICE_UUID);

      const rxChar = await service.getCharacteristic(CHARACTERISTIC_UUID_RX);
      const txChar = await service.getCharacteristic(CHARACTERISTIC_UUID_TX);

      setRxCharacteristic(rxChar);
      setTxCharacteristic(txChar);

      await txChar.startNotifications();
      txChar.addEventListener("characteristicvaluechanged", handleDataReceived);
    } catch (error) {
      console.error("Error en la conexión GATT:", error);
    }
  };

  const handleDataReceived = (event) => {
    const value = event.target.value;
    const received = new TextDecoder().decode(value);
    const cleanReceived = received.trim().toLowerCase();
    setReceivedData((prevData) => prevData + "\n" + received);
    console.log("Datos recibidos:", JSON.stringify(cleanReceived));

    if (waitingForConfirmation.current && cleanReceived === "comando") {
      waitingForConfirmation.current = false;
      clearTimeout(confirmationTimeout.current);

      Swal.fire({
        icon: "success",
        title: "Comunicación exitosa",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const sendData = async (message) => {
    if (rxCharacteristic) {
      try {
        await rxCharacteristic.writeValue(new TextEncoder().encode(message));
        console.log("Mensaje enviado:", message);
      } catch (error) {
        console.error("Error al enviar datos:", error);
      }
    } else {
      console.error("No se encontró la característica RX.");
    }
  };

  const probarComunicacion = async () => {
    if (!rxCharacteristic) {
      console.error("No hay característica RX disponible.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La característica RX no está disponible. Verificá la conexión.",
      });
      return;
    }

    console.log("Enviando comando de prueba...");
    waitingForConfirmation.current = true;

    try {
      await sendData("comando");
    } catch (error) {
      console.error("Error al enviar comando:", error);
      Swal.fire({
        icon: "error",
        title: "Error al enviar",
        text: "No se pudo enviar el comando al dispositivo.",
      });
      waitingForConfirmation.current = false;
      return;
    }

    confirmationTimeout.current = setTimeout(() => {
      if (waitingForConfirmation.current) {
        waitingForConfirmation.current = false;
        Swal.fire({
          icon: "error",
          title: "Sin respuesta",
          text: "No se recibió respuesta del dispositivo.",
          confirmButtonColor: "#EF4444",
        });
      }
    }, 5000);
  };

  const disconnectDevice = () => {
    if (device && device.gatt.connected) {
      device.gatt.disconnect();
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setDevice(null);
    setDeviceName(null);
    setRxCharacteristic(null);
    setTxCharacteristic(null);
    Swal.fire({
      icon: "info",
      title: "Dispositivo desconectado",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div className="p-3 text-center">
      {isConnected ? (
        <div className="space-y-3 space-x-3">
          <h5>Conectado a: {deviceName}</h5>

          <button
            onClick={probarComunicacion}
            className="px-5 py-2 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 hover:shadow-md transition duration-300 ease-in-out flex items-center justify-center"
          >
            <MdOutlineBluetoothConnected className="inline-block mr-2" />
            Probar comunicación
          </button>

          <button
            onClick={disconnectDevice}
            className="px-5 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 hover:shadow-md transition duration-300 ease-in-out flex items-center justify-center"
          >
            <MdOutlineBluetoothDisabled className="inline-block mr-2" />
            Desconectar
          </button>
        </div>
      ) : (
        <button
          onClick={connectToDevice}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 hover:shadow-md transition duration-300 ease-in-out flex items-center justify-center"
        >
          <FaSearch className="inline-block mr-2" />
          Buscar dispositivos
        </button>
      )}
    </div>
  );
};

export default BluetoothConnector;
