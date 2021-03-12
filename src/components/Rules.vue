<template>
  <div class="scrollable h-auto">
    <w-card :title="$t('Time')">
      <w-flex row class="grey-dark1" justify-space-evenly>
        <div>
          <span class="mr2 blue text-bold">{{ $t('Round') }}</span>{{ $t('For combat, each round is less than a minute.') }}
        </div>
        <div class="mx2">
          <span class="mr2 blue text-bold">{{ $t('Turn') }}</span>{{ $t('For dungeon exploration, each turn is around 10 minutes.') }}
        </div>
        <div>
          <span class="mr2 blue text-bold">{{ $t('Watch') }}</span>{{ $t('In wilderness, each watch is 36 turns, about 6 hours.') }}
        </div>
      </w-flex>
    </w-card>

    <w-card :title="$t('Saves')" class="mt2">
      <p class="title3 mb1">
        {{ $t('You roll a d20 equal or under your STR, DEX or WIL. Some saves are special:') }}
      </p>
      <w-flex row class="grey-dark1" justify-space-evenly>
        <div>
          <span class="mr2 blue text-bold">{{ $t('Opposed saves') }}</span>{{ $t('Make a Save, lowest successful value wins.') }}
        </div>
        <div class="mx2">
          <span class="mr2 blue text-bold">{{ $t('Advantage') }}</span>{{ $t('When you roll a Save from a strong position, roll 2d20 and take the lowest result.') }}
        </div>
        <div>
          <span class="mr2 blue text-bold">{{ $t('Disadvantage') }}</span>{{ $t('When you roll a Save from a weakened position, roll 2d20 and take the highest result.') }}
        </div>
      </w-flex>
    </w-card>

    <w-card :title="$t('Fight')" class="mt2">
      <p class="title3 mb1">
        {{ $t('Move and take an action below when it’s your turn.') }}
      </p>
      <w-flex row class="grey-dark1">
        <div>
          <span class="mr2 blue text-bold">{{ $t('Surprise') }}</span>{{ $t('If enemy is surprised, you go before them. If enemy is not surprised, make a DEX Save to act before them.') }}
        </div>
        <div class="mx2">
          <span class="mr2 blue text-bold">{{ $t('Attacks') }}</span>{{ $t('Roll your weapon’s damage die and deal that much to an enemy, minus any armour. When an attack is impaired, deal d4 damage. When an attack is enhanced, deal d12 damage.') }}
        </div>
        <div>
          <span class="mr2 blue text-bold">{{ $t('Damage') }}</span>{{ $t('Damage is dealt to HP first. Once HP is depleted, take damage to STR. After taking STR damage, make a STR Save. On failure, take an Injured condition and are incapacitated.') }}
        </div>
      </w-flex>
      <w-flex row class="grey-dark1 mt2">
        <div>
          <span class="mr2 blue text-bold">{{ $t('Death') }}</span>{{ $t('If STR is reduced to zero, or you are incapacitated for 6 turns, you die.') }}
        </div>
        <div class="ml2">
          <span class="mr2 blue text-bold">{{ $t('Usage') }}</span>{{ $t('After combat, roll d6 for each weapon, ammunition and armour used. On 4-6, mark usage.') }}
        </div>
      </w-flex>
    </w-card>

    <w-card :title="$t('Resting')" class="mt2">
      <w-flex row class="grey-dark1">
        <div>
          <span class="mr2 blue text-bold">{{ $t('Short rest') }}</span>{{ $t('Takes a turn. Restore 1d6+1 HP.') }}
        </div>
        <div class="mx2">
          <span class="mr2 blue text-bold">{{ $t('Long rest') }}</span>{{ $t('Takes a watch. Restore all HP. If HP is full, restore 1d6 to an ability score.') }}
        </div>
        <div>
          <span class="mr2 blue text-bold">{{ $t('Full rest') }}</span>{{ $t('Takes a week. Fully restore HP and ability scores.') }}
        </div>
      </w-flex>
    </w-card>

    <w-card :title="$t('Magic')" class="mt2">
      <w-flex column class="grey-dark1">
        <div>
          {{ $t('Invest 1-3 Power (up to number of unused dots)') }}
        </div>
        <div class="mt2">
          {{ $t('Roll d6 for each Power invested. Mark usage for each die of value 4-5.') }}
        </div>
        <div class="mt2">
          {{ $t('The spell effect happens, using [SUM] and [DICE]') }}
          <blockquote class="text-small">
            {{ $t('Example with a fireball of power 2, the 2d6 roll is 4 and 3. A use is ticked, because of the 4. And, according to the description of the spell, the damage is 7[SUM] + 2[DICE], that is 9 points of damage!') }}
          </blockquote>
        </div>
        <div class="mt2">
          <span class="mr2 blue text-bold">{{ $t('Mishaps') }}</span>{{ $t('For every 6 rolled, take d6 WIL damage. Make a WIL save, gain Mad condition if failed.') }}
        </div>
      </w-flex>
    </w-card>
  </div>
</template>

<script>
export default {
  name: 'Rules',
  data () { return {} }
}
</script>