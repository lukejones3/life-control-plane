import { FormEvent, useState } from "react";
import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { createCredential, LocalCredential, verifyCredential } from "./auth";

export function LockScreen({ credential, onUnlock }: { credential: LocalCredential | null; onUnlock: (credential: LocalCredential) => void }) {
  const [username, setUsername] = useState(credential?.username ?? "Luke");
  const [passcode, setPasscode] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const creating = !credential;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (creating && username.trim().length < 2) return setError("Enter a name with at least 2 characters.");
    if (passcode.length < 6) return setError("Use at least 6 characters for your passcode.");
    if (creating && passcode !== confirm) return setError("The passcodes do not match.");
    setBusy(true);
    try {
      if (creating) onUnlock(await createCredential(username, passcode));
      else if (await verifyCredential(passcode, credential)) onUnlock(credential);
      else setError("That passcode is not correct.");
    } catch {
      setError("This browser could not secure the passcode. Use a current browser over HTTPS.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="lock-screen">
    <section className="lock-card">
      <div className="lock-logo"><Sparkles size={25} /></div>
      <span className="lock-kicker">Life Control Plane</span>
      <h1>{creating ? "Make this space yours." : `Welcome back, ${credential.username}.`}</h1>
      <p>{creating ? "Create a device-local login before adding the app to your home screen." : "Unlock the control plane on this device."}</p>
      <form onSubmit={submit}>
        {creating && <label>Name<input value={username} onChange={event => setUsername(event.target.value)} autoComplete="username" /></label>}
        <label>Passcode<input type="password" inputMode="text" value={passcode} onChange={event => setPasscode(event.target.value)} autoComplete={creating ? "new-password" : "current-password"} autoFocus={!creating} /></label>
        {creating && <label>Confirm passcode<input type="password" value={confirm} onChange={event => setConfirm(event.target.value)} autoComplete="new-password" /></label>}
        {error && <div className="lock-error" role="alert">{error}</div>}
        <button disabled={busy}><LockKeyhole size={17} />{busy ? "Securing…" : creating ? "Create local login" : "Unlock"}</button>
      </form>
      <small><ShieldCheck size={14} /> Your passcode is salted, hashed, and kept only on this device. It is never sent anywhere.</small>
    </section>
  </main>;
}
