import {useState, useEffect} from "react";

export function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController ();
        setLoading(true);
        fetch(url, {signal: abortController.signal})
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => setError(error))
            .finally (() => setLoading(false));
            
            return () => abortController.abort(); //funcion de limpoieza // al final de todo cuando componente se descompone (no aparece en pantalla) return una funcion //limpia listeners y tal
    }, []);

    const handleCancelRequest = () => {
        abortController.abort();jsafhjksf
    }

    return { data, loading, error, handleCancelRequest };

}

