import { X } from "lucide-react";
import { Button } from "./UI";

export function Modal({ title, children, onClose, footer }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <h2>{title}</h2>
          <Button variant="ghost" aria-label="Close modal" onClick={onClose}>
            <X size={18} />
          </Button>
        </header>
        <div className="modal-body">{children}</div>
        {footer ? <footer className="modal-footer">{footer}</footer> : null}
      </section>
    </div>
  );
}
