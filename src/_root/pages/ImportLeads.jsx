import { FileUpload } from "primereact/fileupload";
import { Card } from "primereact/card";
import { BreadCrumb } from 'primereact/breadcrumb';
        

function ImportLeads() {
  const items = [{ label: "Инструменты" }, { label: "Импорт" }];
  return (
    <>
    <BreadCrumb model={items} home={null} />
      <Card>
        <FileUpload
          name="file"
          url={"http://25.18.88.64:8000/api/import-leads"}
          multiple
          emptyTemplate={
            <p className="m-0">Drag and drop files to here to upload.</p>
          }
        />
      </Card>
    </>
  );
}

export default ImportLeads;
