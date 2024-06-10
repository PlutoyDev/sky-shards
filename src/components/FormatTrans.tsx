interface FormatTransProps {
  msg: string;
}

// Format \n as <br>

export default function FormatTrans({ msg }: FormatTransProps) {
  return (
    <>
      {msg.split('\n').map((line, i) => (
        <span key={i}>
          {line}
          <br />
        </span>
      ))}
    </>
  );
}
