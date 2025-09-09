"use client";

import Image from "next/image";
import React, { useEffect, useState, KeyboardEvent, ReactNode } from "react";
import TextareaAutosize from "react-textarea-autosize";

import sparkAnimationData from "./spark.json";
import spinnerAnimationData from "./spinner.json";

import { useLottie } from "lottie-react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { ChatProvider, useChat } from "./chat-context";

function Sidebar() {
  return (
  <div className="fixed z-50 flex flex-col left-0 bg-[#282a2c] w-[72px] h-screen items-center">
      <div className="mt-3 mb-5 flex">
        <Image src="/images/sidebar/menu.png" alt="edit" width={40} height={40} />
      </div>
      <Image src="/images/sidebar/edit.png" alt="edit" width={72} height={40} />
      <Image
        src="/images/sidebar/settings.png"
        alt="settings"
        width={72}
        height={56}
        className=" mt-auto mb-5"
      />
    </div>
  );
}

export function Header() {
  return (
    <div className="flex justify-between bg-[#1b1c1d]">
      <Image src="/images/header/model.png" alt="model" width={115} height={70} />
      <Image src="/images/header/account.png" alt="account" width={129} height={70} />
    </div>
  );
}

export function Banner() {
  return (
    <div className="relative flex items-center justify-center h-12 bg-[#262627]">
      <Image src="/images/header/message.png" alt="message" width={496} height={28} />
      <Image
        className="absolute right-2 top-1"
        src="/images/header/close.png"
        alt="close"
        width={40}
        height={40}
      />
    </div>
  );
}

export function Resource() {
  const [date, setDate] = React.useState("");

  React.useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = now.toLocaleDateString(undefined, options);
    setDate(formattedDate);
  }, []);

  return (
    <Link
      href="https://www.canva.com/design/DAGx2ikwP60/MWWyxxJnt3ReHgSYDm_uBg/view?utm_content=DAGx2ikwP60&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h3a5f12ed03 "
      target='_blank'
      className="bg-[rgb(40,42,44)] w-full p-4 rounded-2xl flex hover:bg-[#3d3f42] items-center"
    >
      <Image
        className="shrink-0 mr-3"
        src="/images/chat/resource.png"
        alt="resource"
        width={20}
        height={20}
      />
      <div className="flex flex-col">
        <p className="font-medium leading-[28px]">Apresentação</p>
        <p className="leading-[20px] text-sm font-normal">{date}</p>
      </div>
      <div className="ml-auto rounded-full px-6 h-10 bg-[rgb(168,199,250)] text-[rgb(6,46,111)] text-sm font-medium flex items-center justify-center">
        Abrir
      </div>
    </Link>
  );
}

export function Welcome() {
  const { isWelcomeVisible } = useChat();

  return (
    <div
      className={twMerge(
        "absolute flex items-center justify-center w-full mb-10 h-full pointer-events-none transition-opacity duration-300",
        isWelcomeVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <Image
        className="mt-[38px]"
        src="/images/chat/hello.png"
        alt="hello"
        width={179}
        height={40}
      />
    </div>
  );
}

export function QueryBubble({ message }: { message: string }) {
  return (
    <div className="rounded-3xl rounded-tr-sm bg-[rgb(51,53,55)] mt-2 px-4 py-3 w-fit ml-auto mb-4">
      <p className="leading-[28px] text-white">{message}</p>
    </div>
  );
}

export function History() {
  const { messages } = useChat();

  const [enableAutoScroll, setEnableAutoScroll] = useState(true);
  const [previousLoading, setPreviousLoading] = useState<boolean>(false);

  useEffect(() => {
    const loading = messages.some((msg) => msg.isLoading);

    if (previousLoading !== loading) {
      setPreviousLoading(loading);
    }

    if (loading) {
      setEnableAutoScroll(true);
    }

    if (!loading && enableAutoScroll) {
      setTimeout(() => {
        setEnableAutoScroll(false);
      }, 1500);
    }
  }, [messages, previousLoading, enableAutoScroll]);

  useEffect(() => {
    if (enableAutoScroll) {
      let currentHeight = 0;
      
      let frameId: number = window.requestAnimationFrame(function scroll() {
        // console.log("currentHeight", currentHeight, document.body.scrollHeight);
        if (currentHeight !== document.body.scrollHeight) {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });

          currentHeight = document.body.scrollHeight;
        }

        frameId = window.requestAnimationFrame(scroll);
      });

      return () => window.cancelAnimationFrame(frameId);
    }

  }, [enableAutoScroll]);

  return (
    <div className="flex-1 flex flex-col-reverse">
      {messages.toReversed().map((message) =>
        message.isUser ? (
          <QueryBubble key={message.id} message={message.content} />
        ) : (
          <QueryAnswer
            key={message.id}
            message={message.token === 1 ? <Answer1 /> : <Answer2 />}
            isLoading={message.isLoading}
          />
        )
      )}
    </div>
  );
}

export function Answer1() {
  return (
    <>
      <p>
        <b>Claro!</b> Preparei uma proposta de estrutura para a sua apresentação
        de <i>Computadores e Sociedade</i> sobre{" "}
        <b>o impacto social das novas tecnologias</b>.
        <br />
        <br />
        Esta versão foi organizada de forma clara, envolvente e dinâmica,
        trazendo <u> tópicos-chave com contexto histórico, exemplos práticos e questões
          para reflexão
        </u>
        . O objetivo é que a apresentação vá além de simplesmente transmitir
        informação: ela deve estimular debates, despertar curiosidade e mostrar
        como o mundo digital está transformando nossa vida cotidiana e as
        relações sociais.
        <br />
        <br />
        Além disso, sugeri algumas provocações e perguntas para engajar o
        público durante os slides.
      </p>
      <br />
      <ul className="list-disc ml-6 space-y-2">
        <li>
          <b>Seção 1: Título e Introdução</b>
          <br />
          <i>O Impacto Social das Novas Tecnologias</i>
          <br />
          Contextualização breve sobre a revolução digital e como ela redefine
          trabalho, educação, cultura e comunicação.
        </li>

        <li>
          <b>Seção 2: O que é a tecnologia?</b>
          <br />
          Definição e papel na sociedade. <br />
          <i>Insight:</i> Tecnologia é uma faca de dois gumes — pode libertar ou
          aprisionar, dependendo de como é usada.
        </li>

        <li>
          <b>Seção 3: A Revolução do Plástico</b>
          <br />
          Do milagre industrial ao desafio ambiental. <br />
          <i>Reflexão:</i> Quando o "toque de Midas" da inovação se transforma
          em problema global?
        </li>

        <li>
          <b>Seção 4: A Tela Touchscreen</b>
          <br />
          Como a invenção popularizada por Steve Jobs mudou o modo de interagir
          com a tecnologia. <br />
          <i>Exemplo:</i> O celular se tornou quase uma extensão do corpo
          humano.
        </li>

        <li>
          <b>Seção 5: Inteligência Artificial (ChatGPT como exemplo)</b>
          <br />A nova “arma” intelectual — potencial para educação,
          produtividade e inovação, mas também para manipulação de informação.
          <br /><i>Pergunta ao público:</i> Até que ponto podemos confiar na IA?
        </li>

        <li>
          <b>Seção 6: Impactos Sociais</b>
          <br />
          Da era da informação à <i>era da pós-verdade</i>. Fake news, bolhas de
          opinião e a crise de confiança nas instituições.
          <br/><i>Discussão:</i> Como equilibrar liberdade digital e responsabilidade
          coletiva?
        </li>

        <li>
          <b>Seção 7: Encerramento e Perguntas</b>
          <br />
          Resumo dos principais pontos + espaço para dúvidas e debate aberto.
        </li>
      </ul>
      <br />
      <p>
        💡 Quer que eu <b>gere os slides automaticamente</b> com design visual e
        imagens de apoio para complementar sua apresentação?{" "}
      </p>
    </>
  );
}

export function Answer2() {
  return (
    <>
      <p>
        Ótimo. Aqui estão seus slides, conforme suas instruções e a estrutura
        gerada.
      </p>
      <Resource />
    </>
  );
}

export function ChatInput() {
  const [inputValue, setInputValue] = useState("");
  const { addMessage, messages } = useChat();

  const anyLoading = messages.some((msg) => msg.isLoading);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      addMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed bottom-0 bg-[#1b1c1d]">
      <div className="w-[760px] flex flex-col px-2 p-2 overflow-hidden border border-[#4a5050] rounded-3xl [box-shadow:color(srgb_0.635294_0.662745_0.690196_/_0.16)_0px_2px_8px_-2px] [transition:border-radius_.1s_cubic-bezier(.2,0,0,1),height_.15s_cubic-bezier(.2,0,0,1)]">
        <TextareaAutosize
          placeholder="Ask Gemini"
          className="mb-2 outline-none overflow px-[12px] py-[9px] font-[400] text-base text-white leading-[24px] resize-none placeholder-[#bdc1c6]"
          spellCheck="false"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex gap-2 items-center">
          <Image src="/images/chat/plus.png" alt="plus" width={40} height={40} />
          <Image src="/images/chat/tools.png" alt="tools" width={87} height={40} />
          <button onClick={handleSubmit} className="ml-auto">
            <Image
              src={anyLoading ? "/images/chat/stop.png" : "/images/chat/send.png"}
              alt="send"
              width={42}
              height={42}
            />
          </button>
        </div>
      </div>
      <p className="my-4 text-center color-[#a2a9b0] text-xs leading-4 opacity-70 font-normal tracking-[0.1px]">
        Gemini can make mistakes, so double-check it
      </p>
    </div>
  );
}

export function Chat() {
  return (
    <div className="flex-1 relative w-[760px] mx-auto pt-4 mt-[120px]">
      <div className="flex flex-col h-full">
        <div className="relative flex-1 w-full mb-[160px]">
          <Welcome />
          <History />
        </div>
        <ChatInput />
      </div>
    </div>
  );
}

// Marker mappings for the Aurora Spinner animation
const SPINNER_MARKERS = {
  "Spinner Loop Start": 0,
  "Single Tool Error": 180,
  "Multiple Tool Error": 360,
  "Track Write on": 930,
  Pause: 959,
  "0%": 1000,
  "100%": 2000,
  "Fade Out": 2006,
} as const;

// Marker mappings for the Spark animation
const SPARK_MARKERS = {
  Start: 0,
  "Hold Small State": 40,
  "Scale Off": 60,
  "Scale On": 80,
  End: 120,
} as const;

export function Avatar({ loading }: { loading?: boolean }) {
  const [previousLoading, setPreviousLoading] = useState<boolean | undefined>(
    undefined
  );

  const { View: SpinnerView, playSegments: playSpinnerSegments } = useLottie(
    {
      animationData: spinnerAnimationData,
      loop: true,
      autoplay: false,
    },
    {
      width: 32,
      height: 32,
      position: "absolute",
      opacity: loading ? 100 : 0,
      transition: "opacity 0.3s ease-in-out",
    }
  );

  const { View: SparkView, playSegments: playSparkSegments } = useLottie(
    {
      animationData: sparkAnimationData,
      loop: false,
      autoplay: false,
    },
    { width: 32, height: 32, position: "absolute" }
  );

  useEffect(() => {
    if (previousLoading !== loading) {
      setPreviousLoading(loading);
    } else {
      return;
    }

    if (loading) {
      // When loading starts, play spinner loop and spark start + hold state
      if (playSpinnerSegments) {
        const startFrame = SPINNER_MARKERS["Spinner Loop Start"];
        const endFrame = SPINNER_MARKERS["Single Tool Error"] - 1; // Loop just before Single Tool Error
        playSpinnerSegments([startFrame, endFrame], true); // Loop continuously
      }

      if (playSparkSegments) {
        // Play the start animation (0-40), then loop hold state (40-60)
        const startFrame = SPARK_MARKERS["Start"];
        const scaleOffFrame = SPARK_MARKERS["Scale Off"];
        playSparkSegments([startFrame, scaleOffFrame - 1], false);

        // After the start animation completes, loop the hold state
        setTimeout(() => {
          if (playSparkSegments) {
            playSparkSegments(
              [
                SPARK_MARKERS["Hold Small State"],
                SPARK_MARKERS["Scale Off"] - 1,
              ],
              true
            ); // Loop hold state
          }
        }, (SPARK_MARKERS["Hold Small State"] / 60) * 1000); // Convert frames to milliseconds (assuming 60fps)
      }
    } else if (loading === false) {
      // When loading completes, play the completion animations: Scale Off → Scale On → End
      if (playSparkSegments) {
        const scaleOffFrame = SPARK_MARKERS["Scale Off"];
        const endFrame = SPARK_MARKERS["End"] + 20; // Include the end duration
        playSparkSegments([scaleOffFrame, endFrame], false);
      }

      if (playSpinnerSegments) {
        const fadeOutFrame = SPINNER_MARKERS["Fade Out"];
        const fadeEndFrame = fadeOutFrame + 20; // Short fade duration
        playSpinnerSegments([fadeOutFrame, fadeEndFrame], false);
      }
    }
  }, [loading, previousLoading, playSpinnerSegments, playSparkSegments]);

  return (
    <div className="relative w-[52px] h-8">
      {SpinnerView}
      {SparkView}
    </div>
  );
}

export function QueryAnswer({
  message,
  isLoading,
}: {
  message?: ReactNode;
  isLoading?: boolean;
}) {
  const { currentStage } = useChat();

  return (
    <div className="flex flex-col pb-5 w-full">
      <div className="flex w-full">
        <Avatar loading={isLoading} />
        <div className="flex-1 flex flex-col">
          <p
            className={twMerge(
              "h-8 font-medium leading-8 hidden",
              isLoading && "block"
            )}
          >
            {isLoading ? currentStage || "Just a sec" : ""}
          </p>
          <div
            className={twMerge(
              "leading-[28px] text-white w-full mb-2 opacity-0 grid transition-all duration-1000 ease-in-out",
              !isLoading && "opacity-100",
              isLoading ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
            )}
          >
            <div className="overflow-hidden w-full">
              <div className="flex flex-col gap-2">
                {/* <p>
                  {message || "I'm Gemini, a large language model trained by Google. I can help you with a variety of tasks, including answering questions, providing explanations, and generating text."}
                </p>
                <Resource /> */}
                {message}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Image
        src="/images/chat/feedback.png"
        alt="feedback.png"
        width={250}
        height={32}
        className={twMerge("hidden", !isLoading && "block")}
      />
    </div>
  );
}

export function Main() {
  return (
    <div className="relative flex-1 flex flex-col bg-[#1b1c1d] min-h-screen">
      <div className="fixed top-0 left-[72px] right-0 z-10">
        <Header />
        <Banner />
      </div>
      <Chat />
    </div>
  );
}

export default function Home() {
  return (
    <ChatProvider>
      <div className="flex pl-[72px] w-screen h-screen">
        <Sidebar />
        <Main />
      </div>
    </ChatProvider>
  );
}
