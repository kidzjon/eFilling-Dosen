import React, { useEffect, useState } from "react";
import { activityApi } from "../../api/activityApi";
import { Table } from "../../components/Table";
import { Button } from "../../components/Button";
import { useNavigate } from "react-router-dom";
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
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Antrian Validasi</div>
          <div className="page-description">
            Daftar aktivitas yang menunggu persetujuan.
          </div>
        </div>
      </div>

      <div className="card">
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
    </>
  );
};

export default ValidationQueue;
