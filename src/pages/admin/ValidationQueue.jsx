import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { activityApi } from "../../api/activityApi";
import { Table } from "../../components/Table";
import { Button } from "../../components/Button";
import { formatDate } from "../../utils/formatDate";

const ValidationQueue = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    activityApi.getPendingForAdmin().then(setData);
  }, []);

  const columns = [
    { key: "title", label: "Judul" },
    { key: "type", label: "Jenis" },
    {
      key: "date",
      label: "Tanggal",
      render: (row) => formatDate(row.date),
    },
  ];

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Antrian Validasi
        </h1>
        <p className="text-sm text-gray-600">
          Daftar aktivitas yang menunggu persetujuan.
        </p>
      </div>

      {/* ================= TABLE ================= */}
      <Table
        columns={columns}
        data={data}
        renderActions={(row) => (
          <Button
            variant="secondary"
            onClick={() => navigate(`/admin/validation/${row.id}`)}
          >
            Review
          </Button>
        )}
      />
    </div>
  );
};

export default ValidationQueue;
