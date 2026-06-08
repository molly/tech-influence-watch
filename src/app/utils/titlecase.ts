export function titlecase(str: string): string {
  let cased = str.replace(/\b[\w.']+\b/g, function (txt) {
    if (["AND", "OF", "THE", "FOR"].includes(txt)) {
      return txt.toLowerCase();
    }
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
  return cased.charAt(0).toUpperCase() + cased.substring(1);
}

export function sentenceCase(str: string, lowercaseRest = true): string {
  // Titlecase just the first letter of the first word
  return (
    str.charAt(0).toUpperCase() +
    (lowercaseRest ? str.substring(1).toLowerCase() : str.substring(1))
  );
}

export function titlecaseCompany(str: string): string {
  let titlecased = titlecase(str);
  if (str.toUpperCase() === "OPENAI") {
    return "OpenAI";
  }
  titlecased = titlecased.replace(
    /\b([A-Z]|AH|TJ|GP|SV|LL(C|P)|DRW|DBA|CMT|RRE|USA|HBAR|BTC|CFG|PAC|AI|HRTG|GV|MVLA|PBC)\b/gi,
    function (txt) {
      return txt.toUpperCase();
    },
  );
  titlecased = titlecased.replace(
    /\b(Ma?c|[OD]')(\w+)\b/gi,
    function (_, m, rest) {
      return m + rest.charAt(0).toUpperCase() + rest.substring(1).toLowerCase();
    },
  );
  return titlecased;
}

export function titlecaseCommittee(
  str: string,
  removeDba: boolean = true,
): string {
  if (str === "ACTBLUE") {
    return "ActBlue";
  }
  if (str === "WINRED") {
    return "WinRed";
  }
  if (removeDba && str.includes(" DBA ")) {
    const splitStr = str.split(" DBA ");
    if (splitStr.length === 2) {
      str = splitStr[1];
    }
  }
  let titlecased = titlecase(str);
  titlecased = titlecased.replace(
    /\b(SMP|LCV|AF(C|P)|UDP|PAC|RSLC|NEA|I{1,3}|DNC|D(C|S)CC|NR(S|C)C|FF|HMP|SFA|SEIU|COPE|AB|ACLU|BA|NY22|DBA|CHC|JD|GSD|JFC|NC|CA|GLCF|SAG|RJC|MA[HG]A|PA|CFG|SLF|CVA|DGA|RA?GA|EDF|PBC|LLC|GTM)\b/gi,
    function (txt) {
      return txt.toUpperCase();
    },
  );
  titlecased = titlecased.replace(/^(.*?) for Congress$/, function (_, name) {
    return `${titlecaseIndividualName(name)} for Congress`;
  });
  titlecased = titlecased.replace(/(.*?) for Us/, function (_, name) {
    return `${titlecaseIndividualName(name)} for US`;
  });
  titlecased = titlecased.replace(" U.s. ", " U.S. ");
  titlecased = titlecased.replace(
    /((?:^|\W)\w{2}) Senate/,
    function (_, state) {
      return `${state.toUpperCase()} Senate`;
    },
  );
  return titlecased;
}

export function titlecaseIndividualName(str?: string | null): string {
  if (!str) {
    return "";
  }
  return str.replace(/\b[\w.']+\b/g, function (x) {
    let cased = titlecase(x);
    cased = cased.replace(/\b(Ma?c|[OD]')(\w+)\b/gi, function (_, m, rest) {
      return m + rest.charAt(0).toUpperCase() + rest.substring(1).toLowerCase();
    });
    return cased;
  });
}

export function titlecaseSuffix(str: string): string {
  if (str.match(/^[IVX]+$/)) {
    return str;
  } else {
    return titlecase(str);
  }
}

export function titlecaseOccupation(str: string): string {
  return titlecase(str)
    .split(" ")
    .map((x) => {
      if (
        x.match(
          /^[^A-Z]*(S?VP|G[PM]|C[A-Z]{2}|US|SRE|HR|MD|AI|RH[FSM]|PX|ESG|IT)[^A-Z]*$/i,
        )
      ) {
        return x.toUpperCase();
      }
      return x;
    })
    .join(" ");
}

export function titlecaseLastFirst(str: string): string {
  const parts = str.split(", ").map((x) => x.trim());
  if (parts.length < 2 || !parts[1]) {
    return titlecaseIndividualName(str);
  }
  const firstname = parts[1].split(" ")[0];
  return titlecaseIndividualName(`${firstname} ${parts[0]}`);
}
