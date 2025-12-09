import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { activityApi } from "../../api/activityApi";
import { Table } from "../../components/Table";
import { Button } from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";

const ActivityList = () => {
  const user = useSelector((s) => s.auth.user);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    activityApi.getByDosen(user.id).then(setData);
  }, [user]);

  const columns = [
    { key: "title", label: "Judul" },
    {
      key: "type",
      label: "Jenis",
      render: (row) => row.type,
    },
    {
      key: "date",
      label: "Tanggal",
      render: (row) => formatDate(row.date),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={
            "status-badge " +
            (row.status === "approved"
              ? "status-approved"
              : row.status === "rejected"
              ? "status-rejected"
              : "status-pending")
          }
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Daftar Aktivitas</div>
          <div className="page-description">
            Semua aktivitas yang telah Anda inputkan.
          </div>
        </div>
        <Button onClick={() => navigate("/dosen/activities/new")}>
          + Tambah Aktivitas
        </Button>
      </div>

      <div className="card">
        <Table
          columns={columns}
          data={data}
          renderActions={(row) => (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate(`/dosen/activities/${row.id}`)}
              >
                Detail
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate(`/dosen/activities/${row.id}/edit`)}
                disabled={row.status === "approved"}
              >
                Edit
              </Button>
            </>
          )}
        />
      </div>
    </>
  );
};

export default ActivityList;
