import { ExcludeXsSizeType, SizeType } from "../helpers/sizeType";
import { TokenIcon } from "../icon";
import { FormattedText, FormattedTextProps } from "./formatted";

export type SymbolProps = FormattedTextProps & {
  size: ExcludeXsSizeType;
};

export const SymbolText = (props: SymbolProps) => {
  return (
    <FormattedText
      {...props}
      as="span"
      rule={"symbol"}
      // @ts-ignore
      prefix={<TokenIcon name={props.children as string} size={props.size} />}
    />
  );
};
