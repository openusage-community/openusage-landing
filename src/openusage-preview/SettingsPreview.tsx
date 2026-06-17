import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import type React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  AUTO_UPDATE_OPTIONS,
  DISPLAY_MODE_OPTIONS,
  MENUBAR_ICON_STYLE_OPTIONS,
  RESET_TIMER_DISPLAY_OPTIONS,
  THEME_OPTIONS,
  TIME_FORMAT_OPTIONS,
  type AutoUpdateIntervalMinutes,
  type DisplayMode,
  type MenubarIconStyle,
  type ResetTimerDisplayMode,
  type ThemeMode,
  type TimeFormatMode,
} from "@/lib/settings"
import type { NavPlugin } from "./SideNav"

type PluginConfig = NavPlugin & {
  enabled: boolean
}

function OptionButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="xs"
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

function SettingsSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="py-3 border-b last:border-b-0">
      <h2 className="text-sm font-semibold mb-2">{title}</h2>
      {children}
    </section>
  )
}

function PluginItem({
  plugin,
  onToggle,
  onClick,
}: {
  plugin: PluginConfig
  onToggle: (id: string) => void
  onClick: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: plugin.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between py-2 gap-3 rounded-md cursor-pointer",
        "border border-transparent",
        isDragging && "opacity-50 border-border"
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="touch-none cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors shrink-0"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <span
          role="img"
          aria-label={plugin.name}
          className="size-5 inline-block shrink-0"
          style={{
            backgroundColor: plugin.brandColor ?? "currentColor",
            WebkitMaskImage: `url(${plugin.iconUrl})`,
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskImage: `url(${plugin.iconUrl})`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
          }}
        />
        <span className="text-sm truncate">{plugin.name}</span>
      </div>
      <span onClick={(event) => event.stopPropagation()}>
        <Checkbox
          key={`${plugin.id}-${plugin.enabled}`}
          checked={plugin.enabled}
          onCheckedChange={() => onToggle(plugin.id)}
          aria-label={`Toggle ${plugin.name}`}
        />
      </span>
    </div>
  )
}

export function SettingsPreview({
  plugins,
  autoUpdateInterval,
  themeMode,
  displayMode,
  resetTimerDisplayMode,
  timeFormatMode,
  menubarIconStyle,
  onPluginToggle,
  onPluginReorder,
  onAutoUpdateIntervalChange,
  onThemeModeChange,
  onDisplayModeChange,
  onResetTimerDisplayModeChange,
  onTimeFormatModeChange,
  onMenubarIconStyleChange,
}: {
  plugins: PluginConfig[]
  autoUpdateInterval: AutoUpdateIntervalMinutes
  themeMode: ThemeMode
  displayMode: DisplayMode
  resetTimerDisplayMode: ResetTimerDisplayMode
  timeFormatMode: TimeFormatMode
  menubarIconStyle: MenubarIconStyle
  onPluginToggle: (id: string) => void
  onPluginReorder: (orderedIds: string[]) => void
  onAutoUpdateIntervalChange: (value: AutoUpdateIntervalMinutes) => void
  onThemeModeChange: (mode: ThemeMode) => void
  onDisplayModeChange: (mode: DisplayMode) => void
  onResetTimerDisplayModeChange: (mode: ResetTimerDisplayMode) => void
  onTimeFormatModeChange: (mode: TimeFormatMode) => void
  onMenubarIconStyleChange: (value: MenubarIconStyle) => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = plugins.findIndex((plugin) => plugin.id === active.id)
      const newIndex = plugins.findIndex((plugin) => plugin.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return
      const next = arrayMove(plugins, oldIndex, newIndex)
      onPluginReorder(next.map((plugin) => plugin.id))
    }
  }

  return (
    <div className="px-0.5">
      <SettingsSection title="Plugins">
        <div className="bg-muted/50 rounded-lg p-1 space-y-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={plugins.map((plugin) => plugin.id)}
              strategy={verticalListSortingStrategy}
            >
              {plugins.map((plugin) => (
                <PluginItem
                  key={plugin.id}
                  plugin={plugin}
                  onToggle={onPluginToggle}
                  onClick={() => onPluginToggle(plugin.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </SettingsSection>

      <SettingsSection title="Auto update">
        <div className="flex flex-wrap gap-1.5">
          {AUTO_UPDATE_OPTIONS.map((option) => (
            <OptionButton
              key={option.value}
              active={autoUpdateInterval === option.value}
              onClick={() => onAutoUpdateIntervalChange(option.value)}
            >
              {option.label}
            </OptionButton>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Appearance">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {THEME_OPTIONS.map((option) => (
              <OptionButton
                key={option.value}
                active={themeMode === option.value}
                onClick={() => onThemeModeChange(option.value)}
              >
                {option.label}
              </OptionButton>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DISPLAY_MODE_OPTIONS.map((option) => (
              <OptionButton
                key={option.value}
                active={displayMode === option.value}
                onClick={() => onDisplayModeChange(option.value)}
              >
                {option.label}
              </OptionButton>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {RESET_TIMER_DISPLAY_OPTIONS.map((option) => (
              <OptionButton
                key={option.value}
                active={resetTimerDisplayMode === option.value}
                onClick={() => onResetTimerDisplayModeChange(option.value)}
              >
                {option.label}
              </OptionButton>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TIME_FORMAT_OPTIONS.map((option) => (
              <OptionButton
                key={option.value}
                active={timeFormatMode === option.value}
                onClick={() => onTimeFormatModeChange(option.value)}
              >
                {option.label}
              </OptionButton>
            ))}
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Menu bar icon">
        <div className="grid grid-cols-3 gap-1.5">
          {MENUBAR_ICON_STYLE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onMenubarIconStyleChange(option.value)}
              className={cn(
                "rounded-md border px-2 py-2 text-xs transition-colors",
                menubarIconStyle === option.value
                  ? "bg-primary text-primary-foreground border-transparent"
                  : "border-border bg-background hover:bg-muted"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </SettingsSection>
    </div>
  )
}
