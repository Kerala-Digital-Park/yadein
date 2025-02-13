import { useState, useEffect } from "react";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

function useFetchMappings(students) {
  const [classMap, setClassMap] = useState({});
  const [batchMap, setBatchMap] = useState({});

  useEffect(() => {
    if (students.length === 0) return;

    const classFormIds = [...new Set(students.map((s) => s.classForm))];
    const batchIds = [...new Set(students.map((s) => s.batch))];

    const fetchMappings = async () => {
      try {
        const classResponses = await Promise.all(
          classFormIds.map((id) =>
            axios.get(`${baseURL}/admin/get-class-form/${id}`).catch(() => null)
          )
        );

        const batchResponses = await Promise.all(
          batchIds.map((id) =>
            axios.get(`${baseURL}/admin/get-batch/${id}`).catch(() => null)
          )
        );

        const classData = {};
        classResponses.forEach((res, index) => {
          if (res && res.data) {
            classData[classFormIds[index]] = res.data.classForm;
          }
        });

        const batchData = {};
        batchResponses.forEach((res, index) => {
          if (res && res.data) {
            batchData[batchIds[index]] = res.data.year;
          }
        });

        setClassMap(classData);
        setBatchMap(batchData);
      } catch (error) {
        console.error("Error fetching class and batch mappings:", error);
      }
    };

    fetchMappings();
  }, [students]);

  return { classMap, batchMap };
}

export default useFetchMappings;
