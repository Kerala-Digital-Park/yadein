import { useState, useEffect } from "react";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

function useFetchMappings(students) {
  const [classMap, setClassMap] = useState({});
  const [batchMap, setBatchMap] = useState({});

  useEffect(() => {
    if (!students || students.length === 0) return;

    // Filter out undefined/null classForm and batch values
    const classFormIds = [
      ...new Set(students.map((s) => s.classForm).filter(Boolean)),
    ];
    const batchIds = [...new Set(students.map((s) => s.batch).filter(Boolean))];

    const fetchMappings = async () => {
      try {
        const classResponses = await Promise.all(
          classFormIds.map((id) =>
            axios
              .get(`${baseURL}/admin/get-class-form/${id}`)
              .then((res) => ({ id, data: res.data.classForm }))
              .catch(() => null)
          )
        );

        const batchResponses = await Promise.all(
          batchIds.map((id) =>
            axios
              .get(`${baseURL}/admin/get-batch/${id}`)
              .then((res) => ({ id, data: res.data.year }))
              .catch(() => null)
          )
        );

        // Transform responses into key-value mappings
        const classData = classResponses.reduce((acc, item) => {
          if (item) acc[item.id] = item.data;
          return acc;
        }, {});

        const batchData = batchResponses.reduce((acc, item) => {
          if (item) acc[item.id] = item.data;
          return acc;
        }, {});

        setClassMap(classData);
        setBatchMap(batchData);
      } catch (error) {
        console.error("Error fetching class and batch mappings:", error);
      }
    };

    if (classFormIds.length > 0 || batchIds.length > 0) {
      fetchMappings();
    }
  }, [students]);

  return { classMap, batchMap };
}

export default useFetchMappings;
